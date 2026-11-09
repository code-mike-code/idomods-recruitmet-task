# SOLLUX – landing page

Zadanie rekrutacyjne IdoMods: landing page z Figmy w czystym HTML, CSS i JS, bez zależności.

## Dostępność

Elementy potrzebne tylko dla dostępności, których nie ma w projekcie, są w strukturze strony, ale ukryte w widoku:

| Element | Działanie | Kiedy widoczny |
| --- | --- | --- |
| `.skip-link` | przejście do treści | po fokusie z klawiatury |
| `.hero__pause` | zatrzymanie automatycznej zmiany slajdów | po fokusie z klawiatury |
| `.shader-cta__pause` | zatrzymanie animacji tła | po fokusie z klawiatury |
| `.visually-hidden` | nagłówki sekcji i etykiety dla czytników ekranu | nigdy |

Przyciski pauzy pokazują się po fokusie, bo osoba korzystająca z klawiatury musi widzieć, gdzie jest. Klasa `.visually-hidden-focusable` przycina je, a nie usuwa, więc zostają dostępne dla czytników ekranu.

Przy `prefers-reduced-motion: reduce` animacja tła startuje zatrzymana.

## Decyzje i założenia

- Figma ma tylko widok 1920 px. Układ stopki na mniejszych ekranach (kolumny linków 2 → 3 → 5, panele jeden pod drugim) jest założeniem.
- „Zmień ustawienia ciasteczek” to zwykły link, bo strona nie ma banera cookies. Po jego dodaniu ten element powinien stać się przyciskiem `<button>`, który otwiera ustawienia.
- Poprawione literówki z projektu: „Wpsółpraca” → „Współpraca”, „Dla Architekta” → „Dla architekta”, „(Pn - Pt 7:00 - 15:00)” → „(pn.–pt. 7:00–15:00)”.
