# Dziennik pracy z AI

Co AI zrobiło źle, dlaczego i jak zostało to poprawione.

| Data | Co było źle | Dlaczego | Jak poprawione |
|---|---|---|---|
| 2026-11-06 | Plan zakładał 3 osobne wycinki lamp z przezroczystym tłem. Lampy 1 i 3 mają w eksporcie nieprzezroczyste tło. | AI uznało eksport za gotowy wycinek, przezroczystość potwierdziło dopiero testem kanału alfa. | Użyta warstwa `hero-lamps` z surowego pliku Figmy: 1920×1080, przezroczysta, zgodna pozycją ze slajdem 1. |
| 2026-11-06 | Ukryty sprite SVG był widoczny i dodawał 150 px nad hero. | Reguła `svg { display: block }` z resetu nadpisała atrybut `hidden`. Header leżał absolutnie, więc błąd wyszedł dopiero z hero. | Dodana reguła `[hidden] { display: none; }` w `base.css`. |
