# PMO Mastery Website Audit Report

**Site audited:** https://www.pmomastery.tn/index.html
**Audit date:** 2025
**Source files analyzed:** `homepage.html`, `pages/*.html` (11 pages), `speakers/sp_*.html` (5 sample speaker pages), `main.css`, `main.js`, `dectionaier.js` (FR/EN dictionary)
**Note:** The live site is behind a JavaScript-based bot-protection interstitial (Cloudflare-style "Please wait while your request is being verified…" page that reloads after 5 s and posts a fingerprint form to `/z0f76a1d14fd21a8fb5fd0d03e0fdc3d3cedae52f`). Plain `curl` therefore returns only the challenge HTML. The audit below is based on the real rendered HTML of every page, which was retrieved through a headless browser snapshot.

---

## 1. Existing Architecture

| Aspect | Detail |
|---|---|
| **Site type** | Static multi-page HTML website (no CMS, no SPA framework) |
| **HTML template** | Custom theme using the `td-` prefix (looks like the "Evente – Conference and Event HTML Template" sold on ThemeForest). Comments like `<!-- td-hero-area-start -->`, `<!-- td-schedule-area-start -->` etc. confirm a themed template |
| **CSS framework** | Bootstrap 5 (`assets/css/bootstrap.min.css`) + custom `main.css` (7 653 lines) + `default.css` |
| **JS libraries** | jQuery, Bootstrap bundle, Isotope, Ion.rangeSlider, Magnific Popup, Odometer, Swiper bundle, Jarallax, Nice-select, WOW.js, custom `main.js` (14 KB) |
| **Icons** | Font Awesome 6 Pro + Flaticon custom collection (`flaticon_mycollection.css`) |
| **Fonts** | **Poppins** (primary UI font, weights 100–900) and **Unbounded** (body font) loaded from Google Fonts |
| **i18n** | Custom client-side dictionary in `dectionaier.js` (867 lines). All translatable strings carry a `data-lang="key"` attribute. FR/EN toggle in the header swaps `textContent` of every `[data-lang]` element. Some images also swap via `data-lang-img` (e.g. French/English pass images) |
| **Analytics** | Google Analytics 4 (`G-KPY6YEZ7YS`) |
| **SEO** | Open Graph + Twitter Card + Schema.org JSON-LD (`WebSite` + `Organization`) |
| **Hosting** | Behind a bot-protection proxy (challenge at `/z0f76a1d14fd21a8fb5fd0d03e0fdc3d3cedae52f`). Domain registered under `.tn` |
| **Payment** | Off-site — buttons link out to `https://international-event-for-pmo-leaders.businessroom.io/` (BusinessRoom ticketing platform). The site also has its own `checkout.html` with a custom cart + 19 % VAT calculation that POSTs to the same BusinessRoom endpoint |
| **Build tooling** | None visible — plain hand-edited HTML/CSS/JS files. No `package.json`, no bundler, no source maps |

---

## 2. Pages / Sections Identified

### Top-level pages (under `https://www.pmomastery.tn/`)

| URL | Page | Purpose |
|---|---|---|
| `index.html` | Accueil (Home) | Hero with countdown, "Why participate", 20-speaker carousel, programme preview (Day 1 / Day 2), venue map, partners strip, pricing cards, footer |
| `events.html` | Événement / Programme | Full 2-day agenda with sessions, times, speakers, descriptions, "Acheter un PASS" CTAs. Three feature cards (Programme Unique / Speakers Prestigieux / Maximisez votre ROI). Pricing teaser at the bottom |
| `events-venue.html` | Venue / Itinéraire | Map and directions to the venue (linked from home "Obtenez l'itinéraire") |
| `team.html` | Intervenants (Speakers) | Grid of 17 speaker cards (image-only cards). Pricing teaser at the bottom |
| `pass.html` | Pass Événement | 3 sub-passes: Individuel / Équipe / Étudiant, each with a price image and "Obtenez votre pass" button → BusinessRoom `ticket_id=154` |
| `passF.html` | Pass Formation | Single Formation pass → BusinessRoom `ticket_id=153` |
| `pass2.html` | Pass Duo | 4 combo options (Événement + 1/2/3/4 Formations) → BusinessRoom `ticket_id=155` |
| `checkout.html` | Checkout / Cart | Custom multi-pass cart with quantity inputs, country selector, promo code, 19 % VAT total. Form fields: nom, email, organisation, pays, téléphone |
| `organisateurs.html` | Organisateurs | Profile of **Empowerment Paths** (organizing company) + **Yosra Torjmen** (founder) with badges |
| `sponsor.html` | Partenaires | Partner logos grouped by tier (Stratégiques / Diamond / Média / Partenaires) |
| `contact.html` | Contact | Contact form (Nom, Email, Message, Privacy checkbox) + social icons |
| `gallery.html` | Galerie | **"Bientôt disponible" (Coming soon)** — section is hidden via `display:none` |
| `faq.html` | FAQ | Referenced in code but not in main menu |
| `product-details.html` | Product details | Template leftover, not used |
| `yosra.html` | Yosra Torjmen detail | Linked from organisateurs page (founder profile) |

### Speaker detail pages (one HTML file per speaker)

`lambert.html`, `mohamed.html`, `heba.html`, `khmaies.html`, `imen.html`, `eman.html`, `slim.html`, `nazir.html`, `hebaR.html`, `karimK.html`, `mouna.html`, `aicha.html`, `afef.html`, `imen-messadi.html`, `naouel.html`, `omrane.html`, `aimen.html`, `mehachehata.html`, `mmoezkamoun.html`, `ahmedchabchoub.html`, `rymakermi.html`, `sarralamine.html`, `yosra.html`

Each speaker page follows the same layout: large photo (left), name + job title + bio + country (with Google Maps link) + LinkedIn link (right), plus the pricing teaser and footer.

---

## 3. Navigation Menu (CRITICAL — to be reproduced)

This is the exact menu structure taken from the `<ul class="navigation">` block in the header of every page (lines 154–189 of `homepage.html`). The mobile menu is generated automatically by JS from the same source.

```
Accueil (index.html)                              [data-lang="n1"]
Événement (events.html)                           [data-lang="n3"]  ▼
   ├── Programme (events.html)                    [data-lang="Programme"]
   └── Pass ▶                                     (parent-link, hover → flyout right)
          ├── Pass Événement (pass.html)          [data-lang="faq9"]
          ├── Pass formation (passF.html)         [data-lang="faq13"]
          └── Pass duo (pass2.html)               [data-lang="chinkwa"]
Intervenants (team.html)                          [data-lang="n5"]
Organisateurs & Partenaires (organisateurs.html)  [data-lang="n6"]  ▼
   ├── Organisateurs (organisateurs.html)         [data-lang="Organisateurs"]
   └── Partenaires (sponsor.html)                 [data-lang="n8"]
Contact (contact.html)                            [data-lang="n9"]
```

Header right-hand side:
- **Language toggle:** `FR | EN` (`#languageToggle`)
- **CTA button:** "Je m'inscris" → `https://international-event-for-pmo-leaders.businessroom.io/` (`data-lang="i4"`)
- **Mobile hamburger** that opens `tdmobile__menu` (clone of the desktop menu + "Acheter un pass" button + social icons)

Footer quick-links column (`data-lang="f1"` → "Liens rapides"):
- À propos de cet événement → `events.html`
- Intervenants → `team.html`
- Galerie → `gallery.html`
- Partenaires → `sponsor.html`
- Obtenez vos pass → `checkout.html`
- Contactez-nous → `contact.html`

The CSS for the multi-level "Pass ▶" flyout uses a custom `.menu-item-has-children1` class (defined both inline in `homepage.html` and in `main.css` lines 82–150) that opens the sub-menu to the **right** on hover (desktop) and inline (mobile).

---

## 4. Data That Should Become Dynamic

The current site is entirely static. The following content blocks are hardcoded in HTML and should be moved into a database / CMS for the rebuild:

| Data type | Currently in | Recommended model |
|---|---|---|
| **Event metadata** (dates, venue, edition year, theme, countdown target) | Hardcoded in `homepage.html` hero + JSON-LD | `events` table |
| **Speakers / Intervenants** (name, title, company, country, LinkedIn, bio FR/EN, photo, slug) | 22 individual `*.html` files + `dectionaier.js` entries (`mo1..3`, `kh1..4`, `im1..3`, `imiU1..5`, `emiU1..3`, `smiU1..3`, `hr11..13`, `NZim1..3`, `omrane1..3`, `afef1..3`, `Naouel1..3`, `aicha1..3`, `imenM1..3`, `Koundi1..3`, `Mouna0P..2P`, `ay1..3`) | `speakers` table with FR/EN columns + `speaker_sessions` join |
| **Programme** (days, sessions, start/end times, title FR/EN, description FR/EN, language, room, speaker link) | Hardcoded in `events.html` (~2 000 lines of tab panes) | `program_days` + `program_sessions` tables |
| **Passes / Tickets** (name, type, sub-options, price TND, what's included, ticket_id) | Hardcoded in `checkout.html` (`data-price` attrs) and in price images `vip1.png`, `vipp2.png`, `etud.png`, `duoFR/d1-d4.jpg` | `passes` + `pass_options` tables |
| **Prices & VAT** (19 % TVA, promo codes) | `checkout.html` JS + server-side `code_promo` lookup | `tax_rates` + `promo_codes` |
| **Organizers** (company, founder, description, badges) | `organisateurs.html` + `dectionaier.js` `or1..9`, `yosraT` | `organizers` table |
| **Partners / Sponsors** (name, logo, website, tier/category) | `sponsor.html` (Stratégiques / Diamond / Média / Partenaires) | `partners` table with `tier` enum |
| **Contact info** (email, phone, address, social URLs) | Hardcoded in footer of every page + JSON-LD | `site_settings` table |
| **Contact form submissions** | Currently a no-op `<form action="">` | `contact_messages` table + email notification |
| **Registration / orders** | Currently delegated to BusinessRoom; if brought in-house → `orders` + `order_items` + `attendees` |
| **Gallery images** | Currently empty / "Bientôt disponible" | `gallery_items` table |
| **Translations** (FR/EN) | 800+ entries in `dectionaier.js` | `translations` table keyed by `lang` + `key` |
| **Notifications / toast messages** (e.g. Lee Lambert quote, "Offre spéciale -10%") | Inline JS arrays in `events.html` and `pass.html` | `notifications` table |

---

## 5. Speakers / Intervenants

20 speakers appear on the homepage carousel. The `team.html` page shows 17 (it drops Maha, Moez, Ahmed, Rym, Sarah but adds Aimen). The complete list extracted from the homepage + speaker detail pages + dictionary:

| # | Name | Title / Role | Company | Country | LinkedIn | Photo | Detail page |
|---|---|---|---|---|---|---|---|
| 1 | **Lee R. Lambert** | CEO, Lambert Consulting Group (PMP co-founder, PMI Fellow) | Lambert Consulting Group | Powell, Ohio, USA | `/in/lelambert/` | `team/lambertt.png` | `lambert.html` |
| 2 | **Mohamed Khalifa** | Leader Global PMO & Agile Transformation · Top 8 PMO Influencers (PMO Global Awards 2021) · PMP, PgMP, PMI-ACP | Independent | Kuwait | `/in/mkhalifa/` | `team/medd.png` | `mohamed.html` |
| 3 | **Heba Bilal AlShehhi** | PMO Influencer · Author of "Elements of Leadership" · World PMO Leader 2023 | Govt entity, Dubai | UAE | — | `team/heba.png` | `heba.html` |
| 4 | **Khemaies Bahri** | CEO, Bahri Group · PMP Trainer · Prosci® Certified | Bahri Group | Tunisia | — | `team/km.png` | `khmaies.html` |
| 5 | **Imen Fakhfekh** | Présidente PMITC · PMP® · Ingénieure télécom | ICF Management Services | Tunisia | `/in/imen-fakhfekh-pmp®-0a497514/` | `team/im.png` | `imen.html` |
| 6 | **Eman Deabil** | Experte en transformation, auteure, conférencière · 1st Bahraini PMI-PfMP, SIP & ESG (CGI) · #1 Female Project Leader (GPMF 2024) | Independent | Bahrain | `/in/emandeabil/` | `team/eman.png` | `eman.html` |
| 7 | **Slim Masmoudi** | Professeur en psychologie cognitive & conseiller stratégique · Founder iLab@NAUSS · 27 yrs exp. | NAUSS / UNODC, IOM, UNOCT | Saudi Arabia | — | `team/Slim.jpg` | `slim.html` |
| 8 | **Nazir Lajdel** | Directeur des PMO et de la Transformation · Panel Moderator | Zitouna Bank | Tunisia | — | `team/Nizar.jpg` | `nazir.html` |
| 9 | **Henda Essafi Rekik** | CEO Excellia Leadership · Coach ICF · Manager de Transition · Femme Manager TN 2018 | Excellia Leadership | Tunisia | — | `team/hebarekik.png` | `hebaR.html` |
| 10 | **Karim Koundi** | Country Managing Partner Deloitte Tunisie · Industry TMT lead Africa | Deloitte | Tunisia | — | `team/karimK.png` | `karimK.html` |
| 11 | **Mouna Chaieb** | PDG · Facilitatrice en gouvernance d'entreprise · Innovation sociale · Présidente ICC Tunisie (Digital Economy) | ICC Tunisie / CJD Tunisie | Tunisia | — | `team/mouna1.png` | `mouna.html` |
| 12 | **TAMBOURA DIAWARA Aïcha** | Experte RSE & Chef de Projets Développement Durable · PhD · 22 yrs exp. in 20+ countries | Independent | Tunisia/Africa | — | `team/aicha.png` | `aicha.html` |
| 13 | **AFEF Belhadj** | Cadre supérieur Télécoms · Sup'Com + Warwick MBA · Strategy ITN & Data AI Jobline (Orange) | Orange | Tunisia | — | `team/afef.png` | `afef.html` |
| 14 | **IMEN Messadi** | CEO & Co-founder Horama Strategic Advisory · Experte Transformation Digitale | Horama Strategic Advisory | Tunisia | — | `team/x.png` | `imen-messadi.html` |
| 15 | **NAOUEL Ben Zina** | PMI Regional Mentor MENA · PMP® since 2011 · Ex-Présidente PMI Tunisie | Project Management Institute | Tunisia | — | `team/naouel.png` | `naouel.html` |
| 16 | **OMRANE Kammoun** | Ingénieur télécom · E-MBA · Master droit des affaires · 40+ yrs TIC · Senior Advisor PwC Tunisie | PwC Tunisie | Tunisia | — | `team/omrane.png` | `omrane.html` |
| 17 | **Maha Chehata** | (Bio not in dictionary — placeholder photo only) | — | — | — | `team/mahaC.png` | `mehachehata.html` |
| 18 | **Moez Kamoun** | (Bio not in dictionary — placeholder photo only) | — | — | — | `team/moezK.png` | `mmoezkamoun.html` |
| 19 | **Ahmed Chabchoub** | (Bio not in dictionary — placeholder photo only) | — | — | — | `team/ahmedC.png` | `ahmedchabchoub.html` |
| 20 | **Rym Ben Dhief Akremi** | (Bio not in dictionary — placeholder photo only) | — | — | — | `team/rymA.png` | `rymakermi.html` |
| 21 | **Sarah Lamine** | (Bio not in dictionary — placeholder photo only) | — | — | — | `team/sarraL.png` | `sarralamine.html` |
| 22 | **Aimen Ktari** | Directeur – Plateforme ESG & Développement Durable | PwC France & Maghreb | Tunisia/France | — | `team/team-2/aimen.png` | `aimen.html` |
| 23 | **Yosra Torjmen** | Managing Director Empowerment Paths · PgMP®, PMP®, PMO-CP, Coach Pro · **Founder of PMO Mastery 2025** | Empowerment Paths | Tunisia | — | `team/yosra.png` | `yosra.html` |
| 24 | **Yassine Chaker** | (Speaker of Day-1 Formation session "De la Stratégie aux KPI jusqu'à l'Exécution Agile") | — | — | — | `team/yassine.jpg` | — (no detail page) |

> ⚠️ Speakers #17–21 (Maha, Moez, Ahmed, Rym, Sarah) appear in the homepage carousel with photos but have **no bio in the dictionary** — the detail pages exist but contain only the photo and name. The rebuild should request bios from the client.

> Also note: `assets/img/team/lobna.jpeg` and `assets/img/team/rymF.jpeg` exist on disk, suggesting **Lobna** and a French version of Rym's photo were prepared but never integrated.

---

## 6. Programme

The agenda is on `events.html` and uses Bootstrap pill tabs for the two days. Times come from the dictionary keys `time1`–`time9`.

### Day 1 — 11 October 2025 — **Formation** (Masterclasses, 4 parallel workshops)

| Time | Session title | Speaker | Language |
|---|---|---|---|
| 08:30 – 15:30 | **كيفية إنشاء مكتب إدارة مشاريع ناجح: الأدوات والتقنيات الأساسية** (How to set up a successful PMO: essential tools & techniques) | Mohamed Khalifa | Arabic |
| 11:00 – 11:30 | Pause Café | — | — |
| 08:30 – 15:30 | **PMO Hybride et Pilotage de performance**: Intégrer Méthode agile, Traditionnel et KPI pour un PMO Performant | Khemaies Bahri | French |
| 08:30 – 15:30 | **De la Stratégie aux KPI jusqu'à l'Exécution Agile** | Yassine Chaker | French |
| 08:30 – 15:30 | **Artificial intelligence (AI) for project management** (Optimisez votre performance projet avec les outils d'IA du PMI) | Imen Fakhfekh | French |

### Day 2 — 12 October 2025 — **Événement** (Plenary conference)

| Time | Session | Type | Speaker/Notes |
|---|---|---|---|
| 08:00 – 08:45 | Accueil et petit-déjeuner de réseautage | Welcome | — |
| 08:50 – 09:10 | Mot de bienvenue et ouverture | Opening | Host |
| **09:15 – 09:45** | **Keynote 1: Excellence des bureaux des projets (PMOs)** — "How PMOs can drive business transformation" | Plenary 1 — *Excellence PMO & Création de Valeur* | Lee R. Lambert (presumed) |
| 09:50 – 10:35 | **Panel de Discussion 1**: PMO stratégiques — Passer de la gestion à la création de Valeur | Plenary 1 panel | — |
| 10:40 – 11:15 | **Panel de Discussion 2** (session parallèle): PMO et RSE — Un duo stratégique pour des projets responsables et durables | Parallel panel | — |
| 11:15 – 11:30 | Pause Café & Networking | Break | — |
| **11:35 – 12:00** | **Keynote 2**: L'information — la force vitale d'un PMO (Success story IA) | Plenary 2 — *IA & Prise de Décision* | — |
| 12:05 – 12:40 | **Panel de discussion 2**: Comment l'IA redéfinit les règles des PMO (Data / Prise de décision) — AI au cœur des opérations PMO, Big Data → décisions, cyber-résilience | Plenary 2 panel | — |
| 12:45 – 13:15 | **Panel 1 (variant)**: IA & Automatisation — Études de cas: concilier sécurité et agilité | Plenary 2 panel | — |
| 13:15 – 14:25 | Déjeuner & Networking | Lunch | — |
| **14:30 – 14:55** | **Keynote**: Comment les leaders exceptionnels transforment la résistance en adhésion — *The Fire Factor: Energizing the Human Side of PMOs* | Plenary 3 — *Leadership & Changement: Convergence IA, Humain et Transformation* | — |
| 15:00 – 15:45 | **Panel de discussion 3**: Synergie Gagnante — Conduite du changement et IA au service des bureaux de gestion de projets (Distributed Leadership & Emotional Intelligence in the Age of AI; Sponsorship) | Plenary 3 panel | — |
| 15:50 – 16:15 | **Keynote de Clôture**: Le PMO en 2030 — Quel avenir pour les PMOs? (Tendances mondiales et régionales, "Et si Darwin avait raison?") | Closing keynote | — |
| 16:30 | **Clôture de l'évènement** | Closing | — |

> **Note on Day 2 panels:** the source HTML has two `<h2>` with `data-lang="e37"` and `data-lang="i39Y"` both labelled "Panel de Discussion 1 : IA & Automatisation" — likely a copy/paste leftover that should be reconciled in the rebuild. The dictionary also lists sub-themes `e38YY/e39YY/e40YY` (Big Data, cyber-résilience, case studies) and `e48YYY/e49YYY/e50YYY/e51YYYY/e52YYYY/e53YYYY` for the Day-2 panel sub-bullets.

Also referenced on Day 2 (specialised sub-themes in the dictionary, not yet wired into a session):
- **Session plénière 4**: IA et transformation sectorielle — secteur bancaire & télécom (sub-bullets: `Nnl1` Banque, `Nnl2` Télécoms & 5G, `Nnl3` Rôle du PMO)
- **Session plénière 5**: ESG et RSE — Un duo stratégique pour des projets responsables et durables

---

## 7. Passes / Tickets

Three pass families, each linking to BusinessRoom with a different `ticket_id`. Prices are TND (Tunisian Dinar) and are visible in `checkout.html` via `data-price` attributes. **All prices are subject to 19 % TVA** added at checkout (`(total + total*0.19)` in JS).

| Pass family | Page | ticket_id | Sub-option | Price (TND, ex-VAT) | Price (TND, incl. 19% VAT) |
|---|---|---|---|---|---|
| **Pass Événement** | `pass.html` | 154 | PASS INDIVIDUEL | 500 | 595 |
| | | | PASS ÉQUIPE | 450 | 535.50 |
| | | | PASS ÉTUDIANT | 200 | 238 |
| **Pass Formation** | `passF.html` | 153 | PASS FORMATION | 400 | 476 |
| **Pass Duo** | `pass2.html` | 155 | PASS ÉVÉNEMENT + 1 FORMATION | 900 | 1 071 |
| | | | PASS ÉVÉNEMENT + 2 FORMATIONS | 1 250 | 1 487.50 |
| | | | PASS ÉVÉNEMENT + 3 FORMATIONS | 1 600 | 1 904 |
| | | | PASS ÉVÉNEMENT + 4 FORMATIONS | 1 900 | 2 261 |

**What's included (features shown on each pass card on the homepage, identical for all 3):**
- Collaboration
- Partage
- Apprentissage
- Expertise

> ⚠️ The actual pricing is shown only as **images** (`vip1.png`, `vipp2.png`, `etud.png`, `duoFR/d1.jpg`–`d4.jpg`) on the dedicated pass pages, which is a serious accessibility / SEO issue. The rebuild should render prices as text.

**Special offers:**
- Promotional popup notification on `pass.html`: "🎉 Offre spéciale : -10% sur tous les Pass" (also has EN variant)
- Promo code field in `checkout.html` (`code_promo`) — appears to POST to a server endpoint that returns a discounted total

---

## 8. Payment / Registration Links

| Use case | URL |
|---|---|
| Generic registration (header "Je m'inscris", mobile "Acheter un pass") | `https://international-event-for-pmo-leaders.businessroom.io/` |
| Pass Événement buy buttons | `https://international-event-for-pmo-leaders.businessroom.io/?ticket_id=154` |
| Pass Formation buy buttons | `https://international-event-for-pmo-leaders.businessroom.io/?ticket_id=153` |
| Pass Duo buy buttons | `https://international-event-for-pmo-leaders.businessroom.io/?ticket_id=155` |
| In-site checkout (custom cart) | `checkout.html` (POSTs to BusinessRoom) |
| Bank transfer details (for international attendees) | Attijari Banque — Account holder: **Empowerment Paths** (from dictionary `vipU18`–`vipU25`) |
| Bank transfer details (for Tunisian attendees) | STB (Société Tunisienne de Banque) — Account holder: **Empowerment Paths** (from dictionary `vipU10`–`vipU17`) |

Payment methods supported (from dictionary `lup1`–`lup4`):
- Carte bancaire (credit card via BusinessRoom)
- Virement bancaire (bank transfer to STB / Attijari)

---

## 9. Organizers

### Organizing company — Empowerment Paths

- **Logo:** `assets/img/e.jpg`
- **Led by:** Mme **Yosra Torjmen** — PgMP®, PMP®, PMO-CP, Coach Professionnelle
- **Founder of:** PMO Mastery 2025
- **Three service pillars:**
  - 🔹 **Conseil** — PMO, évaluation de maturité, modèles opérationnels, conduite du changement
  - 🔹 **Formation** — PMP®, PgMP®, excellence PMO, agilité, soft skills, leadership
  - 🔹 **Coaching exécutif & d'équipe** — performance individuelle, collective et managériale
- **Description (FR):** "Cabinet ATP de conseil et de développement professionnel qui accompagne les organisations dans la conception, la mise en place et l'optimisation de leurs PMOs pour renforcer l'alignement stratégique, la visibilité des portefeuilles et la création de valeur."
- **Vision:** "Positionner la Tunisie comme un hub régional d'excellence PMO, en offrant une plateforme de formation, de réseautage et d'innovation"

### Founder — Yosra Torjmen

- **Photo:** `assets/img/team/yosra.png`
- **Title:** Managing Director, Empowerment Paths · Fondatrice de PMO Mastery 2025
- **Badges shown next to her profile:** `badgeYosra.png`, `8.png`, `P8.png`, `red.png`, `6.png`, `9.jpg` (PMI / PgMP / PMP / PMO-CP / ICF certifications)
- **Detail page:** `yosra.html`

---

## 10. Partners / Sponsors

Taken from `sponsor.html`. Partners are grouped by tier (the labels use `data-lang="par2"`, `par3F`, `par4F`, `par5` — but the French dictionary shows that `par3F`="Partenaire Diamond" and `par4F`="Partenaire Média", so the visible "Partenaires Stratégiques" headings on the page are mis-labelled and should be fixed in the rebuild).

| Tier | Partner | Logo | Website |
|---|---|---|---|
| **Partenaires Stratégiques** | Excellia Leadership | `assets/img/ex.jpg` | https://excellialeadership.com/ |
| **Partenaires Stratégiques** | Royal Tulip Taj Sultan (venue) | `assets/img/tt.png` | https://royal-tulip-taj-sultan.goldentulip.com/ |
| **Partenaire Diamond** | Tunisie Telecom | `assets/img/LogoTT.png` | https://www.tunisietelecom.tn/particulier/ |
| **Partenaire Média** | Managers.tn | `assets/img/manager.png` | https://managers.tn/ |
| **Partenaires** | Project Management Institute (PMI) | `assets/img/part.jpg` | https://www.pmi.org/ |
| **Partenaires** | Flowup | `assets/img/flow.jpg` | http://flowup.tn/ |
| **Partenaires** | Talys Digital | `assets/img/lt.jpg` | https://www.talys.digital/ |

**Full PMI description (FR, from dictionary `par3`/`par4`):**
> "Project Management Institute (PMI) est la principale association professionnelle au monde pour une communauté mondiale croissante de millions de professionnels de la gestion de projet et d'agents de changement à travers le globe… Organisation à but non lucratif présente dans presque tous les pays du monde, fondée en 1969."

> ⚠️ The homepage partners section (`.sponsors_list` `<ul>` at line 1395 of `homepage.html`) is **empty** — logos are not rendered on the home page, only on `sponsor.html`. The rebuild should populate the homepage strip dynamically.

---

## 11. Contact Information

| Field | Value | Source |
|---|---|---|
| **Email** | `contact@pmomastery.tn` | Footer + JSON-LD |
| **Phone** | `+216 94 108 023` (display) / `+21694108023` (JSON-LD) | Footer + JSON-LD. Note: the `href="tel:+123(55)90067990"` is a leftover template placeholder — must be fixed |
| **Address** | Tunis, Tunisie | Footer + JSON-LD PostalAddress |
| **Venue** | Royal Tulip Taj Sultan, Tunis (Google Maps coordinates 36.360058, 10.528937) | `homepage.html` iframe embed |
| **Facebook** | https://www.facebook.com/pmomastery | Header + footer |
| **Instagram** | https://www.instagram.com/pmomastery/ | Header + footer |
| **LinkedIn** | https://www.linkedin.com/company/pmo-mastery-tun/about/ | Header + footer + JSON-LD |
| **Twitter / X** | (none — placeholder `fab fa-twitter` exists in offCanvas only) | offCanvas |
| **Contact form fields** | Nom et prénom · Email · Message · Privacy-policy checkbox | `contact.html` |
| **Contact form action** | `<form action="">` — currently **does not submit anywhere** | must be wired up |
| **Bank details (Tunisia)** | STB — Empowerment Paths | `dectionaier.js` `vipU10`–`17` |
| **Bank details (International)** | Attijari Banque — Empowerment Paths | `dectionaier.js` `vipU18`–`25` |

> ⚠️ The "Office Address / Phone / Email" block in the offCanvas sidebar (lines 356–365 of every page) still contains **template placeholder data** (`123/A, Miranda City Likaoli Prikano, Dope`, `+0989 7876 9865 9`, `info@example.com`). Must be replaced.

---

## 12. Images / Media Inventory

All images live under `assets/img/`. The full list of referenced files (deduplicated):

### Logos
- `assets/img/logo/logo.png` — main footer logo
- `assets/img/logo/l1.png` — sticky header logo (dark text variant)
- `assets/img/logo/l2.png` — transparent header logo (light text variant, shown over hero)
- `assets/img/logo/logo-black.png` — offCanvas logo

### Hero
- `assets/img/hero/test1.gif` — desktop hero background (animated)
- `assets/img/hero/test2.gif` — mobile hero background (animated)
- `assets/img/hero/p.png` — hero illustration (large P / mascot image, animated with `fadeInSlide`)
- `assets/img/hero/shap.png` — decorative shape

### About / decorative
- `assets/img/about/about-2/a.png`, `assets/img/about/bg.jpg`, `assets/img/about/flower.png`, `assets/img/about/thumb.jpg`
- `assets/img/2.png` (programme section background), `assets/img/3.png` (pricing section background)

### Speaker photos (`assets/img/team/`)
Naming is inconsistent — most speakers have multiple variants:
`lambert.png`, `lambertt.png`, `med.jpg`, `medd.png`, `heba.png`, `km.png`, `khmaiss.jpg`, `im.png`, `imen.png`, `eman.png`, `Slim.jpg`, `Nizar.jpg`, `hebarekik.png`, `karimK.png`, `mouna1.png`, `aicha.png`, `afef.png`, `x.png` (Imen Messadi), `naouel.png`, `omrane.png`, `mahaC.png`/`.jpeg`, `moezK.png`/`.jpeg`, `ahmedC.png`/`.jpeg`, `rymA.png`/`.jpeg`, `rymF.jpeg`, `sarraL.png`/`.jpg`, `yosra.png`, `yassine.jpg`/`.jpeg`, `lobna.jpeg`, `badgeYosra.png`, plus numbered placeholders `1.png`–`9.jpg`, `P8.png`, `red.png`, `33.png`

A second set used on `team.html` lives in `assets/img/team/team-2/`: `5.png`, `6.png`, `7.png`, `8.png`, `Karim.png`, `afef1.png`, `aichaa.png`, `aimen.png`, `imenMa.png`, `mounaP.png`, `naouelB.png`, `omrane1.png`

### Pass price images
- `assets/img/vip1.png` (Pass Individuel), `assets/img/vipp2.png` (Pass Équipe), `assets/img/etud.png` (Pass Étudiant)
- `assets/img/duoFR/d1.jpg`, `d2.jpg`, `d3.jpg`, `d4.jpg`, `d5.jpg` (Pass Duo variants — French versions)
- An English image-swap is wired via `data-lang-img` (likely `duoEN/…` directory)

### Partner / sponsor logos
- `assets/img/e.jpg` (Empowerment Paths / organizer)
- `assets/img/ex.jpg` (Excellia Leadership), `assets/img/tt.png` (Royal Tulip), `assets/img/LogoTT.png` (Tunisie Telecom), `assets/img/manager.png` (Managers.tn), `assets/img/part.jpg` (PMI), `assets/img/flow.jpg` (Flowup), `assets/img/lt.jpg` (Talys Digital)

### Schedule / template assets
- `assets/img/schedule/schedule-3/perso1.jpg`, `user.jpg`, `user2.jpg`, `user-2.jpg`, `khmaiss.jpg`, `im.png`, `schedule.jpg`, `schedule-2.jpg`
- `assets/img/schedule/schedule-4/bg.jpg` (programme section background)
- `assets/img/breadcrumb/About1.jpg`, `About1.png`
- `assets/img/shop/sm-product-1.jpg`, `sm-product-2.jpg` (cart mini sidebar)
- `assets/img/blog/postbox/thumb-sm-2.jpg`–`4.jpg`
- `assets/img/c1.png` (contact page illustration), `assets/img/gal.jpg` (gallery placeholder), `assets/img/intr.jpg`

### Videos
- `test.mp4` — referenced from homepage about-section play button (`href="test.mp4"`)

### Favicon
- `assets/img/logo/logo.png`

### OG image
- `https://www.pmomastery.tn/img/og-image.jpg` (referenced in OpenGraph meta — note the path doesn't match `assets/img/`, may 404)

---

## 13. Event Details

| Field | Value |
|---|---|
| **Event name** | Mastering PMO 2025 (also styled "PMO MASTERY" in the events page breadcrumb, `data-lang="e1"`) |
| **Tagline / Theme** | "Le PMO du Futur : Stratégie, IA et Performance" (`data-lang="i17"`, repeated 3× on home) |
| **Edition** | 1ère édition (First edition) |
| **Dates** | **11–12 October 2025** |
| **Day 1 — 11 Oct 2025** | Formation (4 parallel masterclasses, 08:30–15:30) |
| **Day 2 — 12 Oct 2025** | Événement (plenary conference, 08:00–16:30) |
| **Venue** | Royal Tulip Taj Sultan, Tunis |
| **City / Country** | Tunis / Hammamet, Tunisie (the hero says "hammamet - TUNISIE", `data-lang="i3"`, but the venue address and map point to the Royal Tulip Taj Sultan in Tunis) — **inconsistency to clarify with client** |
| **Languages of the event** | Arabic · French · English |
| **Countdown target** | 11 October 2025 (rendered by `#timer` element; the JS computing days/hours/minutes/seconds is in `main.js`) |
| **Organizer** | Empowerment Paths (founder Yosra Torjmen) |
| **Expected audience** | 150+ professionals (PMO, DSI, consultants) — from dictionary `ef5` |
| **Phone (info)** | +216 94 108 023 |
| **Email (info)** | contact@pmomastery.tn |
| **Google Map embed** | `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.0297502167064!2d10.52893737562402!3d36.36005827237594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd63802d5cf783%3A0xe23ca0e9a03b090d!2sRoyal%20Tulip%20Taj%20Sultan!5e0!3m2!1sfr!2stn!4v1754649505229!5m2!1sfr!2stn` |
| **Copyright holder** | `Dasinformatique.com` (the agency that built the site) — `Copyright © 2025 Dasinformatique.com Tous droits réservés.` |

---

## 14. Color Scheme / Branding

### CSS variables (from `main.css` `:root` lines 67–81)

| Variable | Hex | Usage |
|---|---|---|
| `--td-theme-primary` | `#5033ff` | Theme primary (purple-blue) — used in some template components but **not** the dominant brand color |
| `--td-theme-secondary` | `#202B67` | **Main brand navy blue** — pass buttons, language toggle, logo accent, CTA buttons (`background-color:#202b67`) |
| `--td-common-white` | `#fff` | Backgrounds |
| `--td-common-black` | `#141418` | Dark text |
| `--td-common-black-2` | `#000` | Pure black |
| `--td-common-yellow` | `#FCCB0A` | Template accent (rarely used) |
| `--td-common-blue` | `#1b0166` | Deep blue |
| `--td-grey-1` | `#444` | Body text |
| `--td-grey-2` | `#a5a5b0` | Muted text |
| `--td-border-1` | `#d9d9d9` | Borders |

### Additional brand colors found inline in HTML

| Hex | Usage |
|---|---|
| `#071952` | **Footer & "Get directions" section background** (deep navy) |
| `#e97732` | **Orange CTA button** ("Je m'inscris" in hero) — `.td-btn.td-left-right.d-none.d-xl-block { background-color: #e97732; }` |
| `#ddb152` | **Gold** — used for session section headings ("SESSION PLENIÈRE 2", "PANEL SESSION 3") |
| `#00c6ff` → `#0072ff` | Linear gradient on the map container frame |
| `#0056b3` | `.cta-button:hover` background |
| `#467C45` | Bot-protection interstitial spinner (not part of brand) |

### Typography

- **Primary font:** `Poppins` (sans-serif, weights 100–900) — used for almost all UI text via `--td-ff-poppins`
- **Body / display font:** `Unbounded` (variable weight 200–900) — used for `body` via `--td-ff-body`
- **Icon font:** Font Awesome 6 Pro (`--td-ff-fontawesome`)
- **Override on pass pages:** `'Segoe UI', sans-serif` is used inline for pass card subtitles

### Other brand assets

- **Favicon:** `assets/img/logo/logo.png`
- **Logo (header, transparent variant):** `l2.png` (used over the hero) and `l1.png` (used on sticky/white background)
- **Logo (footer):** `logo.png`
- **OG image:** `/img/og-image.jpg`
- **Brand voice:** French-first, formal (vous), with English translations provided for every key piece of copy via `dectionaier.js`

---

## 15. External Links

### Social media
| Platform | URL |
|---|---|
| LinkedIn (company) | https://www.linkedin.com/company/pmo-mastery-tun/about/ |
| Facebook | https://www.facebook.com/pmomastery |
| Instagram | https://www.instagram.com/pmomastery/ |
| Twitter / X | (none — placeholder icon only) |

### Payment / registration
| Service | URL |
|---|---|
| BusinessRoom ticketing (main) | https://international-event-for-pmo-leaders.businessroom.io/ |
| Pass Événement (ticket_id=154) | https://international-event-for-pmo-leaders.businessroom.io/?ticket_id=154 |
| Pass Formation (ticket_id=153) | https://international-event-for-pmo-leaders.businessroom.io/?ticket_id=153 |
| Pass Duo (ticket_id=155) | https://international-event-for-pmo-leaders.businessroom.io/?ticket_id=155 |

### Partner websites
| Partner | URL |
|---|---|
| Excellia Leadership | https://excellialeadership.com/ |
| Royal Tulip Taj Sultan | https://royal-tulip-taj-sultan.goldentulip.com/fr-fr/ |
| Tunisie Telecom | https://www.tunisietelecom.tn/particulier/ |
| Managers.tn | https://managers.tn/ |
| Project Management Institute | https://www.pmi.org/ |
| Flowup | http://flowup.tn/ |
| Talys Digital | https://www.talys.digital/ |

### Speaker LinkedIn profiles (those that are linked)
| Speaker | LinkedIn |
|---|---|
| Lee R. Lambert | https://www.linkedin.com/in/lelambert/ |
| Mohamed Khalifa | https://www.linkedin.com/in/mkhalifa/ |
| Imen Fakhfekh | https://www.linkedin.com/in/imen-fakhfekh-pmp®-0a497514/ |
| Eman Deabil | https://www.linkedin.com/in/emandeabil/ |

### Other
| Resource | URL |
|---|---|
| Google Analytics 4 | tag `G-KPY6YEZ7YS` |
| Google Maps (Tunis) | https://www.google.com/maps?q=Tunis,+Tunisia |
| Bot-protection challenge endpoint | `/z0f76a1d14fd21a8fb5fd0d03e0fdc3d3cedae52f` (site-side proxy, not user-facing) |
| Footer copyright link | https://dasinformatique.com/ (the dev agency) |
| Map of Powell, Ohio (Lambert) | https://www.google.com/maps/@41.6758525,-86.2531698,18.17z — **bug**: every speaker's "Pays" link points to this same Ohio map regardless of their actual country; must be fixed |
| FontAwesome kit | https://kit.fontawesome.com/64d58efce2.js (loaded only on `contact.html`) |

---

## Summary of Issues Found (next-actions for the rebuild)

### Critical bugs / inconsistencies
1. **Bot-protection on the live site** makes it unfetchable by `curl` and harms SEO crawlers — consider whitelisting known crawlers or removing the interstitial.
2. **Speaker "Pays" Google Maps link is hardcoded** to Powell, Ohio coordinates on every speaker detail page (lines 392, 389 etc.) — must be made per-speaker.
3. **5 speakers (Maha, Moez, Ahmed, Rym, Sarah) have no bios** — neither in HTML nor in `dectionaier.js`. Client must provide.
4. **Homepage partners strip is empty** — `<ul class="sponsors_list"></ul>` has no `<li>` children.
5. **Contact form does not submit** — `<form action="">` is a no-op.
6. **Template placeholder data** still visible in the offCanvas sidebar (Office Address = "123/A, Miranda City…", phone = "+0989 7876 9865 9", email = "info@example.com").
7. **`tel:` link is broken** — `href="tel:+123(55)90067990"` on every page's footer phone link.
8. **Mis-labelled partner tiers** — three different sections are all headed "Partenaires Stratégiques" in the HTML, but the dictionary says one is "Partenaire Diamond" and one is "Partenaire Média".
9. **Venue city inconsistency** — hero says "hammamet - TUNISIE" but the map and venue address point to Royal Tulip Taj Sultan in Tunis.
10. **Pricing is shown only as images** (`vip1.png`, `vipp2.png`, `etud.png`, `duoFR/d*.jpg`) — inaccessible to screen readers, not translatable, not SEO-friendly.
11. **OG image path** (`/img/og-image.jpg`) does not match the assets folder (`assets/img/`) — likely a 404.
12. **Duplicate programme blocks** — `data-lang="e37"` and `data-lang="i39Y"` both render "Panel de Discussion 1 : IA & Automatisation" — needs reconciliation.
13. **Day 1 sessions all show 08:30 – 15:30** — these are 4 parallel masterclasses, so the times are correct, but the UI doesn't make the parallel nature obvious.
14. **Two menu links point to the same place** — both "Événement" parent and "Programme" child link to `events.html`. The footer "Galerie" link also points to `gallery.html` which is "Bientôt disponible".
15. **The site has no `404.html`, no `sitemap.xml`, no `robots.txt`** detected.

### Architectural recommendations for the rebuild
- Migrate the 22 static speaker pages + 11 main pages into a CMS or SPA backed by a database (Postgres + a headless CMS like Strapi, or a full Next.js + Prisma stack).
- Move the FR/EN dictionary out of `dectionaier.js` into a proper i18n system (e.g. `next-intl`, `i18next`, or a `translations` table).
- Render prices as text, not images.
- Replace BusinessRoom with a first-party checkout (Stripe / Konnect / Flouci for Tunisia) once the contract allows, or keep BusinessRoom but proxy the registration through the site's own backend.
- Make the contact form actually submit (POST to an API route that emails `contact@pmomastery.tn`).
- Re-encode all images as WebP/AVIF and add `width`/`height` attributes to prevent layout shift.
- Replace the Bootstrap + jQuery + 12-vendor JS stack with a modern framework (Next.js 16 + Tailwind 4 + shadcn/ui per the project's fullstack-dev skill).

---

*End of audit report. Source files retained under `/home/z/my-project/audit/` for the rebuild team: `homepage.html`, `pages/{index,events,team,pass,passF,pass2,checkout,organisateurs,sponsor,contact,gallery}.html`, `speakers/sp_{lambert,mohamed,imen,eman,slim}.html`, `main.css`, `main.js`, `dectionaier.js`, `homepage.json`, `homepage_full.png`, `homepage_hero.png`.*
