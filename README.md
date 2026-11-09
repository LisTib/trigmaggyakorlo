# Háromszöggyakorló

Online gyakorlóoldal a szinusztétel és a koszinusztétel alkalmazásához, véletlenszerűen generált háromszögekkel.

- szinusztétel: hiányzó oldal (két szög és egy oldal; néha előbb a harmadik szöget kell kiszámolni a szögösszegből)
- szinusztétel: hiányzó szög (két oldal és a nagyobbikkal szemközti szög)
- koszinusztétel: hiányzó oldal (két oldal és a közbezárt szög)
- koszinusztétel: hiányzó szög (három oldal)
- vegyes mód: a diáknak kell eldöntenie, melyik tétel kell; három nehézségi szint

**Menet:**

1. Az ábrán és az adatlistán látszanak az ismert adatok (kék) és a keresett mennyiség (piros).
2. A diák kiválasztja a tételt, és nyomógombokkal (`a`, `b`, `c`, `sin α`, `cos β`, …) kitölti a tétel sablonját. A program ellenőrzi, hogy a felírás helyes-e, és hogy egyetlen ismeretlen van-e benne.
3. A program behelyettesít, a diák pedig az egyenletmegoldás (mérlegelv) lépéseivel oldja meg: mindkét oldal szorzása, osztása, hozzáadás, kivonás, kiszámolás, oldalcsere, végül √, sin⁻¹ vagy cos⁻¹.

Van segítség (melyik tétel, javasolt következő lépés), visszalépés és megoldás megmutatása. Az eredmények a böngésző `localStorage`-ában maradnak meg.

Az oldal egyetlen önálló fájl (`index.html`), build nélkül működik.

## Ellenőrzés

    node tests/verify.js

A motor (generátorok, tételellenőrzés, egyenletek és átalakítások) az `index.html` `ENGINE START` és `ENGINE END` jelölése között van.
