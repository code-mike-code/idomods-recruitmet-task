# Dziennik pracy z AI

Co AI zrobiło źle, dlaczego i jak zostało to poprawione.

| Data | Co było źle | Dlaczego | Jak poprawione |
|---|---|---|---|
| 2026-11-06 | Plan zakładał 3 osobne wycinki lamp z przezroczystym tłem. Lampy 1 i 3 mają w eksporcie nieprzezroczyste tło. | AI uznało eksport za gotowy wycinek, przezroczystość potwierdziło dopiero testem kanału alfa. | Użyta warstwa `hero-lamps` z surowego pliku Figmy: 1920×1080, przezroczysta, zgodna pozycją ze slajdem 1. |
| 2026-11-06 | Ukryty sprite SVG był widoczny i dodawał 150 px nad hero. | Reguła `svg { display: block }` z resetu nadpisała atrybut `hidden`. Header leżał absolutnie, więc błąd wyszedł dopiero z hero. | Dodana reguła `[hidden] { display: none; }` w `base.css`. |
| 2026-11-07 | Plan kafelków znów pytał o kontrast białego tekstu na zdjęciu THORO. | AI potraktowało decyzję o kontraście jako dotyczącą tylko hero i Konfiguratora, a nie całej strony. | Zasada dla całej strony: kolory i kontrast jak w Figmie, bez dopytywania. |
| 2026-11-07 | Sekcja shader: nagłówek za mały, smugi zamiast ciągłego światła, widoczny przycisk pauzy. | AI oszacowało rozmiar z rastra, animację zgadło z pojedynczej klatki, a przycisk spoza projektu pokazało w widoku. | Rozmiar liczony z 640 px pierwszej linii, stałe pasmo światła z ruchomymi cieniami, elementy dostępności ukryte i opisane w `readme.md`. |
| 2026-11-07 | Cienie w shaderze sunęły liniowo i dość szybko, wbrew wytycznym: wolne tempo i ruch falujący. | AI wzięło z wytycznych tylko długość pętli, a resztę pominęło. | Cienie falują na sumie sinusów (ease-in-out) w pętli 28 s, bez przejazdu przez cały ekran. |
| 2026-11-09 | Cienie w shaderze nadal ruszały się za szybko. | AI dobrało amplitudę falowania na oko i oceniło tempo tylko po długości pętli. Przy 28 s i dużym wychyleniu cienie i tak przesuwały się szybko. | Pętla wydłużona do 30 s (górna granica wytycznych), amplituda falowania zmniejszona ponad dwukrotnie. |
