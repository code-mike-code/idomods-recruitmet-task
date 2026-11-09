// Motion is built only from whole sine cycles per loop, so the last frame equals
// the first one and there is no visible cut. Figma asks for 20-30s and a wavy move.
const LOOP_DURATION = 30000;

// Soft shapes need no sharpness, so half resolution keeps the GPU load low.
const RENDER_SCALE = 0.5;
const MAX_PIXEL_RATIO = 1.5;

const VERTEX_SHADER = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec2 uResolution;
  uniform float uProgress;

  const vec3 INK = vec3(16.0, 16.0, 17.0) / 255.0;
  const vec3 GOLD = vec3(242.0, 191.0, 37.0) / 255.0;

  const float SHADOW_SLANT = 0.95;
  const float SHADOW_SOFTNESS = 0.1;

  const float TAU = 6.2831853;

  // A row of slim shadows that sways sideways, measured in section heights.
  // The sines ease in and out by nature, and the second one hides the repetition.
  float shadow(vec2 point, float period, float width, float seed) {
    float time = TAU * uProgress;
    float position = point.x + point.y * SHADOW_SLANT + seed;
    position += 0.2 * sin(time + seed) + 0.05 * sin(2.0 * time + seed * 1.7);
    position += 0.03 * sin(point.y * 2.4 + time + seed);
    float cell = fract(position / period) - 0.5;
    return 1.0 - smoothstep(width, width + SHADOW_SOFTNESS, abs(cell) * period);
  }

  // Breaks up colour banding in the long dark gradients.
  float dither(vec2 pixel) {
    return fract(sin(dot(pixel, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 point = vec2(uv.x * uResolution.x / uResolution.y, uv.y);
    // The light itself never moves: one band from edge to edge, rising to the right.
    float edge = 0.62 + 0.3 * uv.x;
    float band = 1.0 - smoothstep(0.0, edge, uv.y);
    float lit = 1.0 - 0.95 * shadow(point, 3.1, 0.07, 0.0);
    lit *= 1.0 - 0.9 * shadow(point, 2.3, 0.03, 0.6);
    lit *= 1.0 - 0.9 * shadow(point, 4.3, 0.14, 1.4);
    // Exponential roll-off keeps the bright areas soft instead of clipping to flat gold.
    vec3 color = mix(INK, GOLD, 1.0 - exp(-2.2 * pow(band * lit, 1.6)));
    gl_FragColor = vec4(color + dither(gl_FragCoord.xy) / 255.0, 1.0);
  }
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(gl) {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  // One triangle larger than the viewport covers the whole canvas.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  return {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    progress: gl.getUniformLocation(program, 'uProgress'),
  };
}

export function initShaderCta(section) {
  const canvas = section.querySelector('.shader-cta__canvas');
  const pauseButton = section.querySelector('.shader-cta__pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return;

  let uniforms = createProgram(gl);
  if (!uniforms) return;

  let isUserPaused = reducedMotion.matches;
  let isOnScreen = true;
  let elapsed = 0;
  let previousTime = null;
  let frame = null;

  const draw = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.progress, elapsed / LOOP_DURATION);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (time) => {
    elapsed = (elapsed + time - (previousTime ?? time)) % LOOP_DURATION;
    previousTime = time;
    draw();
    frame = requestAnimationFrame(tick);
  };

  const syncPlayback = () => {
    const shouldRun = !isUserPaused && isOnScreen && !document.hidden && uniforms;
    if (shouldRun && frame === null) {
      previousTime = null;
      frame = requestAnimationFrame(tick);
    } else if (!shouldRun && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };

  const syncPauseButton = () => {
    section.classList.toggle('shader-cta--stopped', isUserPaused);
    pauseButton.setAttribute('aria-label', isUserPaused ? 'Wznów animację tła' : 'Zatrzymaj animację tła');
  };

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO) * RENDER_SCALE;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (uniforms) draw();
  };

  pauseButton.addEventListener('click', () => {
    isUserPaused = !isUserPaused;
    syncPauseButton();
    syncPlayback();
  });

  reducedMotion.addEventListener('change', () => {
    isUserPaused = reducedMotion.matches;
    syncPauseButton();
    syncPlayback();
  });

  document.addEventListener('visibilitychange', syncPlayback);

  new IntersectionObserver(([entry]) => {
    isOnScreen = entry.isIntersecting;
    syncPlayback();
  }).observe(section);

  new ResizeObserver(resize).observe(canvas);

  // A lost context shows the CSS fallback until the browser restores it.
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    uniforms = null;
    section.classList.remove('shader-cta--ready');
    syncPlayback();
  });

  canvas.addEventListener('webglcontextrestored', () => {
    uniforms = createProgram(gl);
    if (!uniforms) return;
    resize();
    section.classList.add('shader-cta--ready');
    syncPlayback();
  });

  resize();
  syncPauseButton();
  section.classList.add('shader-cta--ready');
  syncPlayback();
}
