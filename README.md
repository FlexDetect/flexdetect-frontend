

# FlexDetect Frontend

## Vsebina
- [Pregled](#pregled)
- [Tehnološki sklad](#tehnološki-sklad)
- [Arhitektura in struktura](#arhitektura-in-struktura)
- [Glavne funkcionalnosti](#glavne-funkcionalnosti)
- [Integracija z API-ji](#integracija-z-api-ji)
- [Uporabniška izkušnja](#uporabniška-izkušnja)
- [Navodila za razvoj](#navodila-za-razvoj)
- [Testiranje](#testiranje)

---

## Pregled
Spletni uporabniški vmesnik FlexDetect omogoča interaktivno upravljanje sistema za zaznavanje prilagodljivosti porabe energije. Namenjen je enostavni uporabi in vizualnemu prikazu kompleksnih podatkov.

---

## Tehnološki sklad
- **Jezik:** JavaScript (ES2025)
- **Okvir:** React 18 + Redux za stanje aplikacije
- **Stiliranje:** CSS Modules + SASS
- **Gradnja:** Webpack + Babel
- **Testiranje:** Jest + React Testing Library

---

## Arhitektura in struktura
- Modularna komponentna zasnova
- Ločena plast za upravljanje stanja (Redux)
- Dinamična nalaganja komponent za boljšo odzivnost
- Responsivni dizajn za vse naprave (mobile-first)

---

## Glavne funkcionalnosti
- Prijava/odjava uporabnikov z varnostnimi mehanizmi
- Nalaganje in pregledovanje podatkovnih poročil
- Vizualizacija časovnih vrst z interaktivnimi grafikoni (D3.js)
- Nastavitve uporabniškega računa in prikaza
- Izvoz podatkov v različnih formatih (CSV, PDF)

---

## Integracija z API-ji
- Komunikacija preko REST protokola z mikrostoritvami backend-a
- Avtomatsko obnavljanje JWT tokenov
- Napredno upravljanje napak in prikaz sporočil uporabniku

---

## Uporabniška izkušnja
- Hitro in tekoče nalaganje strani
- Intuitiven dizajn za minimalno učno krivuljo
- Podpora za večjezičnost (trenutno Slovenščina in angleščina)

---

## Navodila za razvoj
- Slediti smernicam ESLint in Prettier
- Pisati čiste in ponovno uporabne komponente
- Uporabljati Storybook za razvoj UI komponent izolirano

---

## Testiranje
- Pisanje enotnih in integracijskih testov
- Pokritost kritičnih funkcij nad 90%
- Avtomatsko izvajanje testov preko CI/CD pipeline

---

**Avtor:** Aljaž Brodar  
**Zadnja posodobitev:** 1. december 2025
