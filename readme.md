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
