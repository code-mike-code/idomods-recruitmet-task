# Zasady pracy nad projektem dla Claude Code

## Kontekst
Zadanie rekrutacyjne na stanowisko **Programista Frontend + AI w IdoMods**.
Cel: wierne zakodowanie landing page'a z projektu w Figmie.
Oceniany jest kod ORAZ sposób współpracy z AI (rozmowa jest oddawana razem z kodem).

Projekt w Figmie:
https://www.figma.com/design/0IEndSXVS1EK98fLXYNnYN/IdoMods-rekrutacja-frontend-AI?node-id=0-1

## Stack (nie zmieniaj bez pytania)
- Czysty **HTML5 + CSS + vanilla JS (ES modules)**,
- **Zero frameworków, zero bundlera, zero zależności npm.** Projekt musi działać po otwarciu przez prosty serwer statyczny na każdym systemie operacyjnym,
- Nie dodawaj bibliotek (sliderów, jQuery, Tailwinda) jeśli uznasz, że jakaś jest naprawdę potrzebna: zatrzymaj się, uzasadnij i zapytaj

## Źródło prawdy = Figma
- Wartości (kolory, fonty, rozmiary, odstępy, promienie, cienie) bierz **z Figmy przez MCP**, nie ze screenshota i nie „na oko”!
- Nie zgaduj, jeśli czegoś nie ma w projekcie (stan hover, wersja mobilna, zachowanie elementu), **zapytaj** albo zaproponuj rozwiązanie i oznacz je jako założenie
- Kod wygenerowany przez MCP Figmy (np. React/Tailwind) traktuj jako **referencję wartości**, nie jako kod do skopiowania, przepisz go na semantyczny HTML + CSS według zasad poniżej,

## Struktura
```
index.html
css/tokens.css      ← zmienne CSS z Figmy (kolory, typografia, spacing)
css/base.css        ← reset, typografia bazowa
css/sections/*.css  ← jeden plik na sekcję strony
js/main.js          ← cały JS (moduły w js/modules/ tylko jeśli faktycznie potrzebne)
assets/images, assets/icons, assets/fonts
docs/ai-log.md      ← dziennik: co AI zrobiło źle i jak to poprawiliśmy
```

## HTML
- Semantyka: `header`, `nav`, `main`, `section` (z nagłówkiem), `footer`, eden `h1`, hierarchia nagłówków bez przeskoków,
- Linki to `<a>`, akcje to `<button>`. Nigdy `div` z `onclick`,
- Każdy `<img>`: `alt` (pusty dla dekoracyjnych), `width`, `height`; poniżej pierwszego ekranu `loading="lazy"`,
- Ikony: inline SVG albo `<img>` z SVG; dekoracyjne z `aria-hidden="true"`,
- Bez zbędnych wrapperów – jeśli `div` nie ma powodu istnieć, usuń go,

## CSS
- **Mobile-first**, breakpointy przez `min-width`, zgodne z projektem (zdefiniowane w tokens.css jako komentarz/zmienne),
- Wszystkie wartości z Figmy jako **custom properties** w `tokens.css`, w sekcjach używaj zmiennych,
- Nazewnictwo **BEM** (`.hero`, `.hero__title`, `.hero__title--accent`),
- Niska specyficzność: klasy, bez ID w selektorach, bez `!important`
- Layout: flexbox/grid, `gap` zamiast marginesów między dziećmi, płynna typografia `clamp()` tam, gdzie ma sens,
- Jednostki: `rem` dla typografi i odstępów, `px` dla borderów,

## JS
- Tylko tam, gdzie CSS nie wystarczy (np. menu mobilne),
- `<script type="module" src="js/main.js">`, bez globalnych zmiennych,
- Progressive enhancement: treść dostępna bez JS,
- Dostępność interakcji: `aria-expanded`, `aria-controls`, obsługa klawiatury (Esc zamyka menu), widoczny `:focus-visible`

## Wydajność
- Obrazy: WebP/AVIF z rozsądnymi rozmiarami, `srcset` dla dużych grafik,
- Fonty: tylko użyte wagi, `font-display: swap`, preload głównego fontu
- Cel: Lighthouse ≥ 95 we wszystkich kategoriach,

## Sposób pracy
1. **Najpierw plan, potem kod.** Przy nowej sekcji: krótko opisz strukturę HTML i podejście, poczekaj na akceptację,
2. **Jedna sekcja naraz.** Po każdej: porównanie z Figmą (screenshot), poprawki, commit,
3. **Małe commity** w konwencji `feat: sekcja hero`, `fix: odstępy w stopce`, `chore: tokeny z figmy`
4. Jeśli poprawiam Twój błąd – dopisz krótki wpis do `docs/ai-log.md` (co było źle, dlaczego, jak poprawione)
5. Odpowiadaj po polsku,konkretnie i zwięźle, kod, nazwy klas, komentarze, nazwy commitów po angielsku - zawsze!

## Bezpieczeństwo
- **Nigdy** nie zapisuj tokenów/kluczy (np. tokenu Figmy) w repo ani w kodzie,
- Nie wypisuj sekretów w odpowiedziach - rozmowa zostanie wyeksportowana i wysłana rekruterom
