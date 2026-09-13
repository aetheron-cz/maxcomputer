# MAX COMPUTER — ukázka návrhu

Statický web, bez build kroku: `index.html` + `style.css` + `app.js` + `images/`.
Zdroj obsahu: www.maxcomputer.cz (stránky *nabízíme, ochrana počítačů, razítka, služby,
reference, kontakty, o nás*).

---

## Směr návrhu

**„Servisní pult"** — světlý, přesný, retailový rejstřík. Bílá a chladná stříbrná plocha,
grafitové bloky pro důraz, značková oranžová jako jediný signál.

| | |
|---|---|
| Písmo | **IBM Plex Sans Condensed** (nadpisy) × **IBM Plex Sans** (text, ceny, tabulky) |
| Grafit | `#14161a` text, `#1b1e24` tmavé bloky |
| Plochy | `#ffffff`, `#f2f4f6`, `#e7eaee` |
| Oranžová | `#e8581f` (velké akcenty), `#c04412` (drobný text, tlačítka — kvůli kontrastu) |

### První obrazovka

Rozložení podle vzoru českých e-shopů s elektronikou (předloha od klienta: incomputer.cz):
tři dlaždice, dohromady na jednu obrazovku.

```
┌───────────────────────────────┬──────────────────┐
│                               │  OCHRANA · ESET  │
│   PRODEJNA — karusel          │  grafit, krabice │
│   4 snímky, šipky, tečky      ├──────────────────┤
│                               │  RAZÍTKA TRODAT  │
│                               │  od 410 Kč       │
└───────────────────────────────┴──────────────────┘
        AKTUÁLNÍ NABÍDKA · SLUŽBY A CENÍK · …
```

**Karusel prodejny** má čtyři snímky: notebooky Acer, tiskárny Brother, doprodej
Acer eKinekt (−40 %) a počítač na míru (fotka). Přepíná se šipkami, tečkami, šipkami na
klávesnici i tahem prstem. Sám se posouvá každých 6,5 s, zastaví se při najetí myší,
fokusu a po první ruční interakci; při `prefers-reduced-motion` se nehýbe vůbec.
Skryté snímky jsou mimo pořadí tabulátoru.

**Výška dlaždic** je `clamp(460px, 100svh − navigace − 36px, 640px)`, takže se hero vejde
na první obrazovku a pod ním vykoukne začátek další sekce.

**Úvodní animace:** dlaždice najedou postupně (prodejna, ESET, razítka). Přeruší ji první
scroll, dotyk nebo klávesa; s `prefers-reduced-motion` se nespustí.

**Mobil:** karusel přes celou šířku, pod ním ESET a razítka. Tablet: karusel nahoře,
ESET a razítka vedle sebe.

### Hlavička

Podle skutečných českých e-shopů (incomputer.cz používá **Rubik**, TS Bohemia Roboto):
přátelské UI písmo, žádné podtržení odkazů, logo jako obrázek, telefon s ikonou.

- **Písmo navigace:** Rubik 500. Nadpisy na webu zůstávají v IBM Plex Sans Condensed.
- **Odkazy bez podtržení.** Při najetí jen změní barvu na tmavší oranžovou.
- **Telefon jako tlačítko:** šedá „pilulka" s oranžovou ikonou, při najetí oranžová.
- **Stav prodejny beze změny** („Zavřeno · otevíráme v pondělí v 8:00"), včetně polední pauzy.
- **Skutečné logo klienta** místo sázeného textu. Vytažené z jejich souboru `logo-fb.png`:
  logo bylo natištěné na šedém přechodu, takže jsem pro každý pixel dopočítal průhlednost
  proti dvěma barvám inkoustu (oranžová a jejich šedá `#585859`) a odstranil zbytky rámečku.
  Tmavá verze v hlavičce, bílá v patičce. **Zdroj má jen 375 px** — pro ostrý tisk nebo velké
  použití je potřeba originál loga ve vektoru, na webu v hlavičce ale vypadá čistě.

**Vlastní prvky**

1. **Živý stav prodejny** v hlavičce i v kontaktu. Počítá se z reálné otevírací doby
   (Po–Pá 8:00–12:30, 13:00–17:00) v pásmu Europe/Prague — včetně polední pauzy.
   Ukazuje „Otevřeno · zavíráme v 17:00", „Polední pauza", „Zavřeno · otevíráme zítra v 8:00".
2. **Skutečné logo klienta.** Vytažené z jejich vlastního souboru s průhledností, tmavé v hlavičce a bílé v patičce. Favicon zůstává zjednodušený (myš).
3. **Aktuální nabídka** — všech osm produktů s reálnou cenou v mřížce hned pod hero; tlačítka z karuselu vedou sem.
4. **Ceník ve čtyřech svislých dlaždicích** vedle sebe: servis a opravy, instalace
   Windows, výjezd a pomoc na dálku, prodej a ostatní. Uvnitř skutečné řádky ceníku
   s tečkovanou vodicí linkou, dole u každé dlaždice tmavý cenový štítek jako na regálu
   v prodejně („od 800 Kč/hod", „120 Kč za spojení"…), který zároveň vede na objednávku.
   Stejný jazyk jako dlaždice v hero, žádné „tarify" se zvýrazněnou prostřední kartou.
   Tablet: dvě vedle sebe. Mobil: pod sebou.
   Proti Alze je transparentní cena ta nejsilnější zbraň.
5. **Diplom ESET** jako důkaz, ne jako tvrzení.

---

## Co je pravé

Vše převzato z jejich webu: adresa, IČO 48093513, DIČ CZ7505300066, účet, telefony,
e-maily, kompetence obou lidí, otevírací doba, ceník servisu, ceník razítek Trodat,
postup vzdálené pomoci, texty o ESETu, produkty i ceny, a jejich vlastní fotky
(produkty, prodejna, diplom ESET, razítko).

## Co je zástupné — před ostrým nasazením vyměnit

| Soubor | Co s tím |
|---|---|
| `images/hero-deska.jpg` | Stock (Unsplash), rozebraný notebook shora. Záměrně **ne** Apple. Použitá ve 4. snímku karuselu (počítač na míru). Nahraditelné vlastní fotkou z dílny. |
| `images/razitko-printy.png` | Jejich vlastní fotka razítka z původního webu, jen oříznutá a zbavená bílého pozadí. Zdroj má **181×300 px**, takže je v dlaždici trochu měkká. **Ideální je vyfotit skutečné razítko.** Oficiální fotky Trodatu jsou za ochranou proti robotům, proto jsem je nestahoval. |
| `images/prodejna.jpg` | Jejich vlastní fotka, ale 640×480 z roku 2013 (v regálech Nokia). **Přefotit.** |
| Kontaktní formulář | V ukázce neodesílá. Potřebuje backend nebo službu typu Formspree. |

---

## Co ještě stojí za doplnění

**Hodnocení na Googlu.** V jejich vlastním zápisu na Mapách svítí **4,8 z 102 recenzí**.
Je to nejsilnější důkaz, který mají, a na webu není. Číslo se ale mění, takže ho před
nasazením ověřte a teprve pak doplňte — do panelu „Ochrana" nebo ke kontaktům.

**Fotky lidí a dílny.** Jan Vávra a Roman Schmidt jsou na stránce jen jako jména
a telefony. Dvě portrétní fotky a jeden záběr servisního pultu by web posunuly nejvíc
ze všeho.

---

## Čeho se návrh záměrně vyhýbá

Obhlídka konkurence (pocitacerm.cz, jtcomputer.cz, comfor.cz, prahacomp.cz) ukázala,
co je v oboru zvykem a co je naopak šablona:

- **Mřížka hodnotových hesel** typu „Individuální přístup / Odborné poradenství /
  Profesionální řešení / Flexibilita" — má ji konkurence, my ne.
- **„Více informací"** pod každou kartou.
- **Modrý přechodový banner** s nalepeným logem.
- **Rámeček 1 px kolem každé karty** a všude stejné zaoblení.
- **Odhalování obsahu při scrollu** u každé sekce. Jediná animace na webu je ta úvodní.
- **Stejná hlavička u všech sekcí.** Střídají se tři varianty.

Barvy: konkurence jede skoro bez výjimky modrou. Oranžová Max Computeru je v oboru
rozlišovací znak, proto zůstala.

**ESET Bronze Partner** má konkurent v pravém horním rohu každé stránky. Max Computer je
**Zlatý partner od roku 2004 a čtyřnásobný Top Partner** — silnější karta, proto je
uvedená hned v panelu ochrany, ne až v patičce.

---

## Co jsem našel na starém webu (podklad k jednání)

- **Dvě různé ceny za vzdálenou pomoc.** Stránka *služby* uvádí `15 Kč/min`,
  stránka *nabízíme* `13 Kč/min` (a příklad „půlhodina = 510 Kč", což sedí na 13 Kč).
  V návrhu je **15 Kč/min** podle oficiálního ceníku a příklad s 510 Kč jsem vynechal.
  **Nutno potvrdit, která cena platí.**
- **Ceník je zastaralý.** „Upgrade Windows 7 na Windows 10" — Windows 10 skončil podporu
  v říjnu 2025. Přepsal jsem řádek na „Upgrade systému Windows" se stejnou cenou;
  ceny je potřeba projít.
- **Stránka *reference* je prázdná** („Obsah není dostupný"). V návrhu není —
  vymýšlet si reference nebudu. Až budou, je pro ně místo.
- **Web běží jen na `http://`**, bez certifikátu.
- **Žádný favicon**, chybí popisky stránek (`<meta name="description">` je prázdný).
- **Google Analytics `ga.js`** — verze vypnutá v roce 2019, neměří tedy vůbec nic.
- **Žádná mobilní verze.** Pevná šířka, layout postavený na obrázkových pozadích.
- „155 Praha 5" v patičce (chybí `00`), na stránce kontaktů je to správně.
- Tvrzení **„počtvrté ESET Top Partner"** pochází z jejich textu, diplom je z roku 2014.
  Stojí za to ověřit aktuální počet.

---

## Ochrana návrhu

`COPYRIGHT.txt`, `robots.txt` (zákaz indexace včetně GPTBot/CCBot/ClaudeBot),
`noindex` v hlavičce, vodoznak „Ukázka návrhu · Aetheron" a JS proti stahování
(pravé tlačítko, tažení obrázků, Ctrl/Cmd+S/U, DevTools).

**Poctivě: JS je jen odrazení.** Vypnutý JavaScript, `curl` nebo DevTools ho obejdou.
Skutečná ochrana je: repozitář **soukromý** (Netlify / Cloudflare Pages / Vercel
umí nasadit i z privátního repa zdarma) + vodoznak + `noindex`.
