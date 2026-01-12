# Zaznavanje energetske prilagodljivosti v objektih

Na običajen delovni dan se v živahni poslovni stavbi z vidika energije veliko dogaja. Klimatska naprava se vklopi, v sejnih sobah se prižgejo luči, na mizah se polnijo prenosniki. Poraba energije se skozi dan povečuje in zmanjšuje, vendar distribucijsko električno omrežje včasih zahteva spremembo: zmanjšaj porabo energije v naslednji uri ali celo povečanje porabe energije za stabilizacijo oskrbe. Objekt se prilagaja preko prilagojevanja nastavitev termostatov, zaustavi se nebistvena oprema in tudi praznjenje baterij. Od zunaj se nič ne zdi drugače, vendar se v ozadju poraba energije prilagaja z zmanjšanjem, premikom ali celo povečanjem obremenitve, da se podpre omrežje. Energetski dobavitelji potrebujejo zanesljiv način zaznave prilagajanja električne energije, ne le z vidika kdaj se je zgodila ampak tudi koliko energije je bilo dejansko prilagojene. Cilj je razviti spletno aplikacijo, ki bo operatorjem objektov omogočala zaznavo dogodkov, ko se električna energija prilagodi in izmerila vpliv z razlikovanjem med normalno porabo energije in pa namernimi spremembami.


# Tehnična specifikacija problema

Odziv na povpraševanje (angl. demand response) je strategija, ki se uporablja za zmanjšanje ali premik porabe energije v odziv na potrebe električnega omrežja. V nekaterih jurisdikcijah lahko stavbe svojo sposobnost prilagajanja obremenitve prodajo operaterjem omrežja ali agregatorjem. Za trgovanje na trgu prilagodljivosti morajo kupci in prodajalci biti sposobni zaznati, kdaj se energija prilagaja, in meriti, koliko energije je bilo prestavljeno/odstranjeno. Dogodki odziva na povpraševanje lahko prinesejo dva izida: bodisi zmanjšanje ali povečanje neto moči v času trajanja aktiviranega načina. Ti izidi so označeni z zastavicami odziva odjema (Demand Response Flags), kjer -1 pomeni zmanjšanje, +1 pa povečanje neto moči v primerjavi z normalno (referenčno) porabo energije. Referenčni dogodek je označen z zastavico odziva odjema z vrednostjo nič.![Stavba lahko prilagodi svojo obremenitev z zmanjšanjem (a), povečanjem (b) ali premikom (c). Pri premiku obremenitve se oznaka odziva na povpraševanje začne z +1, sledijo pa ji -1. Zmanjšanje porabe energije v stavbi je označeno z oranžno barvo, povečanje pa z modro barvo. Razlika v porabi energije v stavbi je zmogljivost odziva na povpraševanje, ko se aktivira dogodek odziva na povpraševanje.](https://images.aicrowd.com/uploads/ckeditor/pictures/1450/content_Picture1.png)

Cilj projekta je identifikacija in estimacija aktivnosti odziva na povpraševanje s pomočjo pristopov strojnega učenja, glede na podatke objektov, ki jih uporabnik posreduje. Zelimo določiti, kdaj so bili aktivirani dogodki odziva na povpraševanje in kako dolgo so trajali, ter za koliko se je povečala ali zmanjšala poraba energije (v času trajanja dogodka) v primerjavi z običajno porabo, kot rezultat aktiviranja načina odziva na povpraševanje.

# FlexDetect Frontend

## Vsebina
- [Pregled](#pregled)
- [Arhitektura in struktura](#arhitektura-in-struktura)
- [Glavne funkcionalnosti](#glavne-funkcionalnosti)
- [Integracija z API-ji](#integracija-z-api-ji)


---

## Pregled
Spletni uporabniški vmesnik FlexDetect omogoča interaktivno upravljanje sistema za zaznavanje prilagodljivosti porabe energije. Namenjen je enostavni uporabi in vizualnemu prikazu kompleksnih podatkov.


---


## Arhitektura in struktura
- Modularna komponentna zasnova
- Dinamična nalaganja komponent za boljšo odzivnost

---

## Glavne funkcionalnosti
- Prijava/odjava uporabnikov z varnostnimi mehanizmi
- Nastavitve uporabniškega računa in prikaza
- Izvoz podatkov v različnih formatih (CSV, JSON)

---

## Integracija z API-ji
- Komunikacija preko REST protokola z mikrostoritvami backend-a
- Avtomatsko preverjanje JWT tokenov
---

**Avtor:** Aljaž Brodar  
