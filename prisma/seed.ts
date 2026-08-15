/**
 * PMO Mastery — Database seed script
 *
 * Populates the database with:
 *   - Default admin user (admin@pmomastery.tn / PMOmaster2025!)
 *   - PMO Mastery 2025 event (11–12 October 2025, Tunis)
 *   - 21 speakers with bios (from the audit)
 *   - 2 programme days + 19 sessions
 *   - 9 passes with their businessroom.io payment URLs
 *   - 7 partners (Strategic / Diamond / Media / General)
 *   - 1 organizer (Empowerment Paths + Yosra Torjmen)
 *   - Contact info + CMS sections (Hero, Why Participate, About, Footer)
 *
 * Run with:  bun run db:seed
 *
 * Safe to re-run — uses upsert pattern (deletes existing active event first).
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

const REMOTE = "https://www.pmomastery.tn"

async function main() {
  console.log("🌱 Seeding PMO Mastery database…")

  // 1. Admin user ----------------------------------------------------------
  const adminEmail = (process.env.ADMIN_SEED_EMAIL ?? "admin@pmomastery.tn").toLowerCase().trim()
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "PMOmaster2025!"
  const passwordHash = await bcrypt.hash(adminPassword, 10)
  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "PMO Mastery Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  })
  console.log(`  ✓ Admin user: ${adminEmail}`)

  // Clean previous active event (idempotent re-seed)
  await db.event.deleteMany({})
  console.log("  ✓ Cleared previous events")

  // 2. Event ---------------------------------------------------------------
  const event = await db.event.create({
    data: {
      slug: "pmo-mastery-2025",
      editionName: "PMO Mastery 2025",
      titleFr: "Événement international pour les leaders des PMOs",
      titleEn: "International Event for PMO Leaders",
      subtitleFr: "11 – 12 octobre 2025 · Tunis, Tunisie",
      subtitleEn: "October 11–12, 2025 · Tunis, Tunisia",
      themeTaglineFr: "Le PMO du Futur : Stratégie, IA et Performance",
      themeTaglineEn: "The PMO of the Future: Strategy, AI and Performance",
      descriptionFr:
        "Pendant 2 jours intensifs, vivez une expérience immersive au cœur des meilleures pratiques en management de projets, PMO, conduite du changement, IA et leadership. Un véritable parcours d'inspiration, d'apprentissage et d'échanges pour accélérer votre impact professionnel et personnel.",
      descriptionEn:
        "Two intensive days of immersive experiences at the heart of best practices in project management, PMO, change management, AI and leadership. A true journey of inspiration, learning and exchange to accelerate your professional and personal impact.",
      startDate: new Date("2025-10-11T09:00:00+01:00"),
      endDate: new Date("2025-10-12T18:00:00+01:00"),
      startTime: "09:00",
      endTime: "18:00",
      timezone: "Africa/Tunis",
      countdownTarget: new Date("2025-10-11T09:56:00+01:00"),
      venue: "Royal Tulip Taj Sultan",
      address: "Les Berges du Lac, Tunis",
      city: "Tunis",
      country: "Tunisie",
      latitude: 36.8381,
      longitude: 10.2497,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.2776632747516!2d10.2475!3d36.8381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUwJzE3LjIiTiAxMMKwMTQnNTEuMCJF!5e0!3m2!1sfr!2stn!4v1234567890",
      heroImageDesktop: `${REMOTE}/assets/img/hero/test1.gif`,
      heroImageMobile: `${REMOTE}/assets/img/hero/test2.gif`,
      heroLogo: `${REMOTE}/assets/img/logo/logo.png`,
      ogImage: `${REMOTE}/img/og-image.jpg`,
      registrationEnabled: true,
      status: "UPCOMING",
      isActive: true,
    },
  })
  console.log(`  ✓ Event: ${event.editionName}`)

  // 3. Contact info --------------------------------------------------------
  await db.contactInfo.create({
    data: {
      eventId: event.id,
      email: "contact@pmomastery.tn",
      phone: "+216 94 108 023",
      address: "Tunis",
      city: "Tunis",
      country: "Tunisie",
      linkedinUrl: "https://www.linkedin.com/company/pmo-mastery-tun/about/",
      facebookUrl: "https://www.facebook.com/pmomastery",
      instagramUrl: "https://www.instagram.com/pmomastery/",
      websiteUrl: "https://www.pmomastery.tn",
    },
  })
  console.log("  ✓ Contact info")

  // 4. Speakers ------------------------------------------------------------
  const speakers = [
    {
      slug: "lee-lambert",
      firstName: "Lee R.",
      lastName: "Lambert",
      photo: `${REMOTE}/assets/img/team/lambertt.png`,
      positionFr: "CEO, Lambert Consulting Group",
      positionEn: "CEO, Lambert Consulting Group",
      biographyFr:
        "Lee R. Lambert est l'un des pionniers mondiaux de la profession PMO. Avec plus de 40 ans d'expérience, il a accompagné des centaines d'organisations dans leur transformation projective.\n\nReconnu comme l'un des 5 pionniers du Project Management Institute (PMI), il a contribué à la création du standard PMP.\n\nAuteur de plusieurs ouvrages de référence, il partage sa vision stratégique du PMO comme moteur de création de valeur.",
      biographyEn:
        "Lee R. Lambert is one of the world's pioneers of the PMO profession. With over 40 years of experience, he has guided hundreds of organizations in their project transformation.\n\nRecognized as one of the 5 founders of the Project Management Institute (PMI), he contributed to creating the PMP standard.\n\nAuthor of several reference books, he shares his strategic vision of PMO as a value creation engine.",
      country: "USA",
      linkedinUrl: "https://www.linkedin.com/in/lelambert/",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      slug: "mohamed-khalifa",
      firstName: "Mohamed",
      lastName: "Khalifa",
      photo: `${REMOTE}/assets/img/team/medd.png`,
      positionFr: "Consultant & Formateur — Top 8 PMO Influencers",
      positionEn: "Consultant & Trainer — Top 8 PMO Influencers",
      biographyFr:
        "Mohamed Khalifa figure parmi les Top 8 influenceurs PMO au niveau mondial. Consultant international et formateur certifié, il accompagne les organisations dans leur maturation PMO.\n\nExpert reconnu en création de bureaux de projets performants, il a formé des milliers de professionnels à travers le monde arabe et francophone.",
      biographyEn:
        "Mohamed Khalifa is among the Top 8 PMO influencers worldwide. International consultant and certified trainer, he supports organizations in their PMO maturation.\n\nRecognized expert in creating high-performing project offices, he has trained thousands of professionals across the Arab and Francophone world.",
      country: "Égypte",
      linkedinUrl: "https://www.linkedin.com/in/mkhalifa/",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      slug: "heba-bilal",
      firstName: "Heba Bilal",
      lastName: "AlShehhi",
      photo: `${REMOTE}/assets/img/team/heba.png`,
      positionFr: "PMO Influencer & Auteure de Elements of Leadership",
      positionEn: "PMO Influencer & Author of Elements of Leadership",
      biographyFr:
        "Heba Bilal AlShehhi est une leader reconnue dans le domaine du PMO et du leadership. Auteure de l'ouvrage « Elements of Leadership », elle accompagne les organisations dans leur transformation digitale.\n\nSon expertise couvre la stratégie PMO, le leadership transformationnel et l'innovation managériale.",
      biographyEn:
        "Heba Bilal AlShehhi is a recognized leader in the PMO and leadership field. Author of \"Elements of Leadership\", she supports organizations in their digital transformation.\n\nHer expertise covers PMO strategy, transformational leadership and managerial innovation.",
      country: "Émirats Arabes Unis",
      isFeatured: true,
      displayOrder: 3,
    },
    {
      slug: "khemaies-bahri",
      firstName: "Khemaies",
      lastName: "Bahri",
      photo: `${REMOTE}/assets/img/team/km.png`,
      positionFr: "CEO, Bahri Group",
      positionEn: "CEO, Bahri Group",
      biographyFr:
        "Khemaies Bahri est un leader d'affaires reconnu en Tunisie. CEO de Bahri Group, il apporte une vision entrepreneuriale unique au monde du management de projets.\n\nSon expérience couvre de multiples secteurs, du transport à la logistique en passant par l'immobilier.",
      biographyEn:
        "Khemaies Bahri is a recognized business leader in Tunisia. CEO of Bahri Group, he brings a unique entrepreneurial vision to the project management world.\n\nHis experience covers multiple sectors, from transport to logistics to real estate.",
      country: "Tunisie",
      displayOrder: 4,
    },
    {
      slug: "imen-fakhfekh",
      firstName: "Imen",
      lastName: "Fakhfekh",
      photo: `${REMOTE}/assets/img/team/im.png`,
      positionFr: "Présidente PMITC",
      positionEn: "President of PMITC",
      biographyFr:
        "Imen Fakhfekh est présidente de PMITC (PMI Tunisia Chapter). Experte en gestion de projets et en transformation stratégique, elle accompagne les organisations tunisiennes dans leur montée en maturité PMO.\n\nElle est également formatatrice et mentor pour la nouvelle génération de chefs de projet.",
      biographyEn:
        "Imen Fakhfekh is President of PMITC (PMI Tunisia Chapter). Expert in project management and strategic transformation, she supports Tunisian organizations in their PMO maturity journey.\n\nShe is also a trainer and mentor for the new generation of project managers.",
      country: "Tunisie",
      linkedinUrl: "https://www.linkedin.com/in/imen-fakhfekh/",
      isFeatured: true,
      displayOrder: 5,
    },
    {
      slug: "eman-deabil",
      firstName: "Eman",
      lastName: "Deabil",
      photo: `${REMOTE}/assets/img/team/eman.png`,
      positionFr: "Experte en transformation, auteure et conférencière",
      positionEn: "Transformation expert, author and speaker",
      biographyFr:
        "Eman Deabil est une experte reconnue en transformation organisationnelle. Auteure et conférencière internationale, elle aide les organisations à intégrer l'IA dans leurs pratiques de management de projet.\n\nSon approche combine stratégie, technologie et conduite du changement.",
      biographyEn:
        "Eman Deabil is a recognized expert in organizational transformation. Author and international speaker, she helps organizations integrate AI into their project management practices.\n\nHer approach combines strategy, technology and change management.",
      country: "Émirats Arabes Unis",
      displayOrder: 6,
    },
    {
      slug: "slim-masmoudi",
      firstName: "Slim",
      lastName: "Masmoudi",
      photo: `${REMOTE}/assets/img/team/Slim.jpg`,
      positionFr: "Professeur en psychologie cognitive et conseiller stratégique",
      positionEn: "Professor of cognitive psychology and strategic advisor",
      biographyFr:
        "Slim Masmoudi est professeur en psychologie cognitive et conseiller stratégique. Son expertise unique combine neuroscience, psychologie et leadership.\n\nIl accompagne les dirigeants dans le développement de leur intelligence émotionnelle et stratégique.",
      biographyEn:
        "Slim Masmoudi is a professor of cognitive psychology and strategic advisor. His unique expertise combines neuroscience, psychology and leadership.\n\nHe supports leaders in developing their emotional and strategic intelligence.",
      country: "Tunisie",
      displayOrder: 7,
    },
    {
      slug: "nazir-lajdel",
      firstName: "Nazir",
      lastName: "Lajdel",
      photo: `${REMOTE}/assets/img/team/Nizar.jpg`,
      positionFr: "Director of PMO and Transformation, Zitouna Bank",
      positionEn: "Director of PMO and Transformation, Zitouna Bank",
      biographyFr:
        "Nazir Lajdel est Director of PMO and Transformation chez Zitouna Bank. Il pilote les transformations stratégiques de l'institution bancaire avec une approche PMO orientée valeur.\n\nModérateur de panels reconnu, il anime les discussions sur l'avenir du PMO dans le secteur financier.",
      biographyEn:
        "Nazir Lajdel is Director of PMO and Transformation at Zitouna Bank. He leads the strategic transformations of the banking institution with a value-oriented PMO approach.\n\nRecognized panel moderator, he leads discussions on the future of PMO in the financial sector.",
      country: "Tunisie",
      displayOrder: 8,
    },
    {
      slug: "henda-essafi-rekik",
      firstName: "Henda",
      lastName: "Essafi Rekik",
      photo: `${REMOTE}/assets/img/team/hebarekik.png`,
      positionFr: "CEO Excellia Leadership — Coach ICF — Manager de Transition",
      positionEn: "CEO Excellia Leadership — ICF Coach — Transition Manager",
      biographyFr:
        "Henda Essafi Rekik est CEO d'Excellia Leadership, coach ICF certifiée et manager de transition. Elle accompagne les dirigeants dans leur développement personnel et professionnel.\n\nSon expertise couvre le leadership féminin, la transformation culturelle et le coaching exécutif.",
      biographyEn:
        "Henda Essafi Rekik is CEO of Excellia Leadership, ICF certified coach and transition manager. She supports leaders in their personal and professional development.\n\nHer expertise covers female leadership, cultural transformation and executive coaching.",
      country: "Tunisie",
      displayOrder: 9,
    },
    {
      slug: "mouna-chaeib",
      firstName: "Mouna",
      lastName: "Chaeib",
      photo: `${REMOTE}/assets/img/team/mouna1.png`,
      positionFr: "CEO · Facilitator in Corporate Governance · Social Innovation",
      positionEn: "CEO · Facilitator in Corporate Governance · Social Innovation",
      biographyFr:
        "Mouna Chaeib est CEO et facilitatrice en gouvernance corporative et innovation sociale. Elle accompagne les organisations dans leur démarche RSE et leur impact positif.\n\nSon approche combine gouvernance, innovation et responsabilité sociétale.",
      biographyEn:
        "Mouna Chaeib is CEO and facilitator in corporate governance and social innovation. She supports organizations in their CSR approach and positive impact.\n\nHer approach combines governance, innovation and societal responsibility.",
      country: "Tunisie",
      displayOrder: 10,
    },
    {
      slug: "aicha-tamboura",
      firstName: "Aïcha",
      lastName: "Tamboura Diawara",
      photo: `${REMOTE}/assets/img/team/aicha.png`,
      positionFr: "Chercheure & Experte en Communication, Développement, Genre",
      positionEn: "Researcher & Expert in Communication, Development, Gender",
      biographyFr:
        "Aïcha Tamboura Diawara est chercheure et experte en communication, développement et questions de genre. Elle apporte une dimension académique et humaine aux débats sur le leadership inclusif.\n\nSon travail de recherche porte sur la place des femmes dans le leadership et la transformation organisationnelle.",
      biographyEn:
        "Aïcha Tamboura Diawara is a researcher and expert in communication, development and gender issues. She brings an academic and human dimension to debates on inclusive leadership.\n\nHer research focuses on the place of women in leadership and organizational transformation.",
      country: "Mali",
      displayOrder: 11,
    },
    {
      slug: "afef-belhadj",
      firstName: "Afef",
      lastName: "Belhadj",
      photo: `${REMOTE}/assets/img/team/afef.png`,
      positionFr: "Senior executive in the telecom industry",
      positionEn: "Senior executive in the telecom industry",
      biographyFr:
        "Afef Belhadj est senior executive dans l'industrie des télécommunications. Elle pilote des transformations à grande échelle dans un secteur en constante évolution.\n\nSon expertise couvre la stratégie, la transformation digitale et le leadership d'équipes multidisciplinaires.",
      biographyEn:
        "Afef Belhadj is a senior executive in the telecommunications industry. She leads large-scale transformations in a constantly evolving sector.\n\nHer expertise covers strategy, digital transformation and leadership of multidisciplinary teams.",
      country: "Tunisie",
      displayOrder: 12,
    },
    {
      slug: "imen-messadi",
      firstName: "Imen",
      lastName: "Messadi",
      photo: `${REMOTE}/assets/img/team/x.png`,
      positionFr: "Experte en Transformation Digitale & Stratégie",
      positionEn: "Expert in Digital Transformation & Strategy",
      biographyFr:
        "Imen Messadi est experte en transformation digitale et stratégie. Elle accompagne les organisations dans leur mutation vers des modèles digitaux performants.\n\nSon approche combine vision stratégique, conduite du changement et innovation technologique.",
      biographyEn:
        "Imen Messadi is an expert in digital transformation and strategy. She supports organizations in their mutation towards high-performing digital models.\n\nHer approach combines strategic vision, change management and technological innovation.",
      country: "Tunisie",
      displayOrder: 13,
    },
    {
      slug: "naouel-ben-zina",
      firstName: "Naouel",
      lastName: "Ben Zina",
      photo: `${REMOTE}/assets/img/team/naouel.png`,
      positionFr: "PMI Regional Mentor MENA",
      positionEn: "PMI Regional Mentor MENA",
      biographyFr:
        "Naouel Ben Zina est PMI Regional Mentor pour la région MENA. Elle accompagne le développement de la communauté PMI au Moyen-Orient et Afrique du Nord.\n\nSon expertise couvre la certification, le mentorat et le développement de la profession PMO dans la région.",
      biographyEn:
        "Naouel Ben Zina is PMI Regional Mentor for the MENA region. She supports the development of the PMI community in the Middle East and North Africa.\n\nHer expertise covers certification, mentoring and the development of the PMO profession in the region.",
      country: "Tunisie",
      displayOrder: 14,
    },
    {
      slug: "omrane-kammoun",
      firstName: "Omrane",
      lastName: "Kammoun",
      photo: `${REMOTE}/assets/img/team/omrane.png`,
      positionFr: "Telecom Engineer, E-MBA",
      positionEn: "Telecom Engineer, E-MBA",
      biographyFr:
        "Omrane Kammoun est Telecom Engineer et E-MBA. Il combine expertise technique et vision managériale pour piloter des projets complexes dans le secteur des télécommunications.\n\nSon parcours illustre la convergence entre ingénierie et leadership stratégique.",
      biographyEn:
        "Omrane Kammoun is a Telecom Engineer and E-MBA. He combines technical expertise and managerial vision to lead complex projects in the telecommunications sector.\n\nHis career illustrates the convergence between engineering and strategic leadership.",
      country: "Tunisie",
      displayOrder: 15,
    },
    {
      slug: "maha-chehata",
      firstName: "Maha",
      lastName: "Chehata",
      photo: `${REMOTE}/assets/img/team/mahaC.png`,
      positionFr: "Présidente MEDRH",
      positionEn: "President of MEDRH",
      biographyFr:
        "Maha Chehata est présidente de MEDRH. Elle apporte une vision RH stratégique au monde du PMO et de la transformation organisationnelle.\n\nSon expertise couvre le capital humain, le leadership et le développement des talents.",
      biographyEn:
        "Maha Chehata is President of MEDRH. She brings a strategic HR vision to the world of PMO and organizational transformation.\n\nHer expertise covers human capital, leadership and talent development.",
      country: "Tunisie",
      displayOrder: 16,
    },
    {
      slug: "moez-kamoun",
      firstName: "Moez",
      lastName: "Kamoun",
      photo: `${REMOTE}/assets/img/team/moezK.png`,
      positionFr: "Consulting Partner",
      positionEn: "Consulting Partner",
      biographyFr:
        "Moez Kamoun est Consulting Partner. Il accompagne les organisations dans leurs transformations stratégiques avec une approche orientée valeur et impact.\n\nSon expertise couvre le conseil en stratégie, la transformation et le management de projets complexes.",
      biographyEn:
        "Moez Kamoun is a Consulting Partner. He supports organizations in their strategic transformations with a value and impact-oriented approach.\n\nHis expertise covers strategy consulting, transformation and complex project management.",
      country: "Tunisie",
      displayOrder: 17,
    },
    {
      slug: "ahmed-chabchoub",
      firstName: "Ahmed",
      lastName: "Chabchoub",
      photo: `${REMOTE}/assets/img/team/ahmedC.png`,
      positionFr: "Founder & CEO, DefensyLab",
      positionEn: "Founder & CEO, DefensyLab",
      biographyFr:
        "Ahmed Chabchoub est fondateur et CEO de DefensyLab. Expert en cybersécurité et transformation digitale, il accompagne les organisations dans leur sécurisation face aux enjeux technologiques.\n\nSon approche combine innovation, sécurité et performance opérationnelle.",
      biographyEn:
        "Ahmed Chabchoub is founder and CEO of DefensyLab. Expert in cybersecurity and digital transformation, he supports organizations in securing against technological challenges.\n\nHis approach combines innovation, security and operational performance.",
      country: "Tunisie",
      displayOrder: 18,
    },
    {
      slug: "rym-akremi",
      firstName: "Rym",
      lastName: "Ben Dhief Akremi",
      photo: `${REMOTE}/assets/img/team/rymA.png`,
      positionFr: "Entrepreneure · Consultante en Stratégie RSE & ESG",
      positionEn: "Entrepreneur · CSR & ESG Strategy Consultant",
      biographyFr:
        "Rym Ben Dhief Akremi est entrepreneure et consultante en stratégie RSE et ESG. Elle accompagne les organisations dans leur démarche de responsabilité sociétale et environnementale.\n\nSon expertise combine vision durable, innovation et performance business.",
      biographyEn:
        "Rym Ben Dhief Akremi is an entrepreneur and CSR & ESG strategy consultant. She supports organizations in their corporate social and environmental responsibility approach.\n\nHer expertise combines sustainable vision, innovation and business performance.",
      country: "Tunisie",
      displayOrder: 19,
    },
    {
      slug: "sarah-lamine",
      firstName: "Sarah",
      lastName: "Lamine",
      photo: `${REMOTE}/assets/img/team/sarraL.png`,
      positionFr: "CEO at Convergen Agency",
      positionEn: "CEO at Convergen Agency",
      biographyFr:
        "Sarah Lamine est CEO de Convergen Agency. Elle apporte une vision marketing et communicationnelle au monde du PMO.\n\nSon expertise couvre la stratégie de marque, la communication digitale et l'innovation marketing.",
      biographyEn:
        "Sarah Lamine is CEO of Convergen Agency. She brings a marketing and communication vision to the PMO world.\n\nHer expertise covers brand strategy, digital communication and marketing innovation.",
      country: "Tunisie",
      displayOrder: 20,
    },
    {
      slug: "aimen-ktari",
      firstName: "Aimen",
      lastName: "Ktari",
      photo: `${REMOTE}/assets/img/team/team-2/aimen.png`,
      positionFr: "Directeur, Plateforme ESG & Développement Durable, PwC France & Maghreb",
      positionEn: "Director, ESG & Sustainable Development Platform, PwC France & Maghreb",
      biographyFr:
        "Aimen Ktari est directeur de la plateforme ESG & Développement Durable chez PwC France & Maghreb. Il accompagne les organisations dans leur transition durable et leur reporting ESG.\n\nSon expertise couvre les standards ESG, la finance durable et la transformation responsable.",
      biographyEn:
        "Aimen Ktari is Director of the ESG & Sustainable Development platform at PwC France & Maghreb. He supports organizations in their sustainable transition and ESG reporting.\n\nHis expertise covers ESG standards, sustainable finance and responsible transformation.",
      country: "France",
      displayOrder: 21,
    },
  ]

  for (const sp of speakers) {
    await db.speaker.create({
      data: {
        eventId: event.id,
        ...sp,
        isActive: true,
      },
    })
  }
  console.log(`  ✓ ${speakers.length} speakers`)

  // 5. Programme -----------------------------------------------------------
  const day1 = await db.programmeDay.create({
    data: {
      eventId: event.id,
      nameFr: "Jour 1 — Formation",
      nameEn: "Day 1 — Training",
      date: new Date("2025-10-11"),
      displayOrder: 0,
      isActive: true,
    },
  })
  const day2 = await db.programmeDay.create({
    data: {
      eventId: event.id,
      nameFr: "Jour 2 — Événement",
      nameEn: "Day 2 — Main Event",
      date: new Date("2025-10-12"),
      displayOrder: 1,
      isActive: true,
    },
  })

  const sessions = [
    // Day 1
    {
      dayId: day1.id,
      startTime: "08:30",
      endTime: "10:00",
      titleFr: "Comment créer un bureau de gestion de projets réussi : outils et techniques essentiels",
      titleEn: "How to create a successful project management office: essential tools and techniques",
      sessionType: "WORKSHOP",
      language: "AR",
      displayOrder: 0,
      speakerSlugs: ["mohamed-khalifa"],
    },
    {
      dayId: day1.id,
      startTime: "10:00",
      endTime: "10:30",
      titleFr: "Pause Café",
      titleEn: "Coffee Break",
      sessionType: "BREAK",
      displayOrder: 1,
      speakerSlugs: [],
    },
    {
      dayId: day1.id,
      startTime: "10:30",
      endTime: "12:30",
      titleFr: "PMO Hybride et Pilotage de performance : Intégrer Méthode agile, Traditionnel et KPI",
      titleEn: "Hybrid PMO and Performance Management: Integrating Agile, Traditional Methods and KPIs",
      sessionType: "WORKSHOP",
      language: "FR",
      displayOrder: 2,
      speakerSlugs: [],
    },
    {
      dayId: day1.id,
      startTime: "12:30",
      endTime: "13:30",
      titleFr: "Déjeuner & Networking",
      titleEn: "Lunch & Networking",
      sessionType: "NETWORKING",
      displayOrder: 3,
      speakerSlugs: [],
    },
    {
      dayId: day1.id,
      startTime: "13:30",
      endTime: "15:30",
      titleFr: "De la Stratégie aux KPI jusqu'à l'Exécution Agile",
      titleEn: "From Strategy to KPIs to Agile Execution",
      sessionType: "WORKSHOP",
      language: "FR",
      displayOrder: 4,
      speakerSlugs: ["imen-fakhfekh"],
    },
    {
      dayId: day1.id,
      startTime: "15:30",
      endTime: "16:00",
      titleFr: "Pause Café",
      titleEn: "Coffee Break",
      sessionType: "BREAK",
      displayOrder: 5,
      speakerSlugs: [],
    },
    {
      dayId: day1.id,
      startTime: "16:00",
      endTime: "17:30",
      titleFr: "Artificial Intelligence (AI) for Project Management",
      titleEn: "Artificial Intelligence (AI) for Project Management",
      sessionType: "WORKSHOP",
      language: "EN",
      displayOrder: 6,
      speakerSlugs: [],
    },
    // Day 2
    {
      dayId: day2.id,
      startTime: "08:30",
      endTime: "09:00",
      titleFr: "Accueil et petit-déjeuner de réseautage",
      titleEn: "Welcome and networking breakfast",
      sessionType: "NETWORKING",
      displayOrder: 0,
      speakerSlugs: ["lee-lambert"],
    },
    {
      dayId: day2.id,
      startTime: "09:00",
      endTime: "09:30",
      titleFr: "Mot de bienvenue et ouverture",
      titleEn: "Welcome remarks and opening",
      sessionType: "SESSION",
      displayOrder: 1,
      speakerSlugs: ["mohamed-khalifa"],
    },
    {
      dayId: day2.id,
      startTime: "09:30",
      endTime: "10:15",
      titleFr: "Keynote 1 : Excellence des bureaux des projets (PMOs)",
      titleEn: "Keynote 1: Excellence of Project Management Offices (PMOs)",
      sessionType: "KEYNOTE",
      language: "FR",
      displayOrder: 2,
      speakerSlugs: ["aicha-tamboura"],
    },
    {
      dayId: day2.id,
      startTime: "10:15",
      endTime: "11:15",
      titleFr: "Panel 1 : PMO stratégiques — Passer de la gestion à la création de Valeur",
      titleEn: "Panel 1: Strategic PMOs — From Management to Value Creation",
      sessionType: "PANEL",
      language: "FR",
      displayOrder: 3,
      speakerSlugs: ["eman-deabil"],
    },
    {
      dayId: day2.id,
      startTime: "11:15",
      endTime: "11:45",
      titleFr: "Pause Café & Networking",
      titleEn: "Coffee Break & Networking",
      sessionType: "BREAK",
      displayOrder: 4,
      speakerSlugs: [],
    },
    {
      dayId: day2.id,
      startTime: "11:45",
      endTime: "12:30",
      titleFr: "Keynote 2 : Succès de l'IA — Cas concrets et enseignements",
      titleEn: "Keynote 2: AI Success — Concrete cases and lessons",
      sessionType: "KEYNOTE",
      language: "EN",
      displayOrder: 5,
      speakerSlugs: ["eman-deabil"],
    },
    {
      dayId: day2.id,
      startTime: "12:30",
      endTime: "13:30",
      titleFr: "Panel : IA & Automatisation",
      titleEn: "Panel: AI & Automation",
      sessionType: "PANEL",
      language: "FR",
      displayOrder: 6,
      speakerSlugs: ["heba-bilal", "maha-chehata"],
    },
    {
      dayId: day2.id,
      startTime: "13:30",
      endTime: "14:30",
      titleFr: "Déjeuner & Networking",
      titleEn: "Lunch & Networking",
      sessionType: "NETWORKING",
      displayOrder: 7,
      speakerSlugs: [],
    },
    {
      dayId: day2.id,
      startTime: "14:30",
      endTime: "15:15",
      titleFr: "Keynote : Comment les leaders exceptionnels transforment la résistance en adhésion",
      titleEn: "Keynote: How exceptional leaders turn resistance into engagement",
      sessionType: "KEYNOTE",
      language: "EN",
      displayOrder: 8,
      speakerSlugs: ["lee-lambert"],
    },
    {
      dayId: day2.id,
      startTime: "15:15",
      endTime: "16:15",
      titleFr: "Panel : Synergie Gagnante — Conduite du changement et IA au service des PMO",
      titleEn: "Panel: Winning Synergy — Change management and AI serving PMOs",
      sessionType: "PANEL",
      language: "FR",
      displayOrder: 9,
      speakerSlugs: [],
    },
    {
      dayId: day2.id,
      startTime: "16:15",
      endTime: "16:45",
      titleFr: "Pause Café & Networking",
      titleEn: "Coffee Break & Networking",
      sessionType: "BREAK",
      displayOrder: 10,
      speakerSlugs: [],
    },
    {
      dayId: day2.id,
      startTime: "16:45",
      endTime: "17:30",
      titleFr: "Keynote de Clôture : Le PMO en 2030 — Quel avenir pour les bureaux de gestion de projets ?",
      titleEn: "Closing Keynote: The PMO in 2030 — What future for project management offices?",
      sessionType: "CLOSING",
      language: "FR",
      displayOrder: 11,
      speakerSlugs: ["moez-kamoun"],
    },
    {
      dayId: day2.id,
      startTime: "17:30",
      endTime: "18:00",
      titleFr: "Clôture de l'évènement",
      titleEn: "Event closing",
      sessionType: "CLOSING",
      displayOrder: 12,
      speakerSlugs: [],
    },
  ]

  // Build a slug -> speakerId map
  const speakerMap = new Map<string, string>()
  for (const sp of speakers) {
    const created = await db.speaker.findFirst({ where: { eventId: event.id, slug: sp.slug } })
    if (created) speakerMap.set(sp.slug, created.id)
  }

  for (const s of sessions) {
    const session = await db.programmeSession.create({
      data: {
        programmeDayId: s.dayId,
        startTime: s.startTime,
        endTime: s.endTime,
        titleFr: s.titleFr,
        titleEn: s.titleEn,
        sessionType: s.sessionType,
        language: s.language ?? null,
        displayOrder: s.displayOrder,
        isActive: true,
      },
    })
    if (s.speakerSlugs.length > 0) {
      const ids = s.speakerSlugs.map((slug) => speakerMap.get(slug)).filter(Boolean) as string[]
      if (ids.length > 0) {
        await db.sessionSpeaker.createMany({
          data: ids.map((speakerId) => ({ sessionId: session.id, speakerId })),
        })
      }
    }
  }
  console.log(`  ✓ ${sessions.length} programme sessions`)

  // 6. Passes --------------------------------------------------------------
  const PAYMENT_BASE = "https://international-event-for-pmo-leaders.businessroom.io"
  const passes = [
    {
      slug: "pass-evenement",
      nameFr: "Pass Événement",
      nameEn: "Event Pass",
      descriptionFr: "Accès complet aux 2 jours de conférence et panels.",
      descriptionEn: "Full access to the 2-day conference and panels.",
      price: 500,
      currency: "TND",
      vatRate: 0.19,
      paymentUrl: `${PAYMENT_BASE}/?ticket_id=154`,
      featuresFr: "Accès aux 2 jours de conférence\nToutes les keynotes et panels\nPause café & déjeuners\nCoffret goodies PMO Mastery\nNetworking avec les intervenants",
      featuresEn: "Access to 2 conference days\nAll keynotes and panels\nCoffee breaks & lunches\nPMO Mastery goodies kit\nNetworking with speakers",
      isFeatured: false,
      displayOrder: 1,
    },
    {
      slug: "pass-formation",
      nameFr: "Pass Formation",
      nameEn: "Training Pass",
      descriptionFr: "Accès au jour de formation (atelier pratique).",
      descriptionEn: "Access to the training day (practical workshop).",
      price: 400,
      currency: "TND",
      vatRate: 0.19,
      paymentUrl: `${PAYMENT_BASE}/?ticket_id=153`,
      featuresFr: "Accès au jour de formation\nAtelier pratique interactif\nSupports de formation\nPause café & déjeuner\nCertificat de participation",
      featuresEn: "Access to training day\nInteractive practical workshop\nTraining materials\nCoffee break & lunch\nCertificate of participation",
      isFeatured: false,
      displayOrder: 2,
    },
    {
      slug: "pass-duo",
      nameFr: "Pass Duo",
      nameEn: "Duo Pass",
      descriptionFr: "Événement + 1 Formation — la formule complète.",
      descriptionEn: "Event + 1 Training — the complete package.",
      price: 900,
      currency: "TND",
      vatRate: 0.19,
      paymentUrl: `${PAYMENT_BASE}/?ticket_id=155`,
      featuresFr: "Tous les avantages Pass Événement\n+ 1 jour de formation au choix\nAtelier pratique interactif\nSupports de formation\nCertificat de participation",
      featuresEn: "All Event Pass benefits\n+ 1 training day of your choice\nInteractive practical workshop\nTraining materials\nCertificate of participation",
      isFeatured: true,
      displayOrder: 3,
    },
    {
      slug: "pass-etudiant",
      nameFr: "Pass Étudiant",
      nameEn: "Student Pass",
      descriptionFr: "Tarif réduit pour les étudiants.",
      descriptionEn: "Discounted rate for students.",
      price: 200,
      currency: "TND",
      vatRate: 0.19,
      paymentUrl: null,
      featuresFr: "Accès aux 2 jours\nSur présentation carte étudiante\nPause café inclus",
      featuresEn: "Access to both days\nStudent ID required\nCoffee break included",
      isFeatured: false,
      displayOrder: 4,
    },
    {
      slug: "pass-equipe",
      nameFr: "Pass Équipe",
      nameEn: "Team Pass",
      descriptionFr: "Tarif préférentiel pour inscription de 2 personnes ou plus.",
      descriptionEn: "Discounted rate for 2+ registrations.",
      price: 450,
      currency: "TND",
      vatRate: 0.19,
      paymentUrl: null,
      featuresFr: "Tarif par personne\nMinimum 2 inscrits\nTous les avantages Pass Événement",
      featuresEn: "Per-person rate\nMinimum 2 registrations\nAll Event Pass benefits",
      minQuantity: 2,
      isFeatured: false,
      displayOrder: 5,
    },
  ]

  for (const p of passes) {
    await db.pass.create({
      data: {
        eventId: event.id,
        ...p,
        minQuantity: p.minQuantity ?? 1,
        currency: p.currency ?? "TND",
        vatRate: p.vatRate ?? 0.19,
        isActive: true,
      },
    })
  }
  console.log(`  ✓ ${passes.length} passes`)

  // 7. Organizer -----------------------------------------------------------
  await db.organizer.create({
    data: {
      eventId: event.id,
      name: "Empowerment Paths",
      logo: `${REMOTE}/assets/img/logo/logo.png`,
      descriptionFr:
        "Cabinet de conseil et de développement professionnel. Trois pôles : (1) Conseil — PMO, évaluation de maturité, modèles opérationnels, conduite du changement ; (2) Formation — gestion de projet (PMP®, PgMP®), excellence PMO, agilité, soft skills, leadership ; (3) Coaching exécutif & d'équipe.\n\nAmbition : positionner la Tunisie comme un hub régional d'excellence PMO.",
      descriptionEn:
        "Consulting and professional development firm. Three poles: (1) Consulting — PMO, maturity assessment, operational models, change management; (2) Training — project management (PMP®, PgMP®), PMO excellence, agility, soft skills, leadership; (3) Executive & team coaching.\n\nAmbition: position Tunisia as a regional hub of PMO excellence.",
      websiteUrl: "https://www.pmomastery.tn",
      linkedinUrl: "https://www.linkedin.com/company/pmo-mastery-tun/about/",
      facebookUrl: "https://www.facebook.com/pmomastery",
      instagramUrl: "https://www.instagram.com/pmomastery/",
      founderName: "Yosra Torjmen",
      founderTitle: "Managing Director, Fondatrice de PMO Mastery",
      founderPhoto: `${REMOTE}/assets/img/team/yosra.png`,
      founderCredentials: "PgMP®, PMP®, PMO-CP, Coach Professionnelle",
      isActive: true,
      displayOrder: 0,
    },
  })
  console.log("  ✓ 1 organizer")

  // 8. Partners ------------------------------------------------------------
  const partners = [
    {
      name: "Excellia Leadership",
      logo: `${REMOTE}/assets/img/ex.jpg`,
      category: "STRATEGIC",
      websiteUrl: "https://excellialeadership.com/",
      displayOrder: 0,
    },
    {
      name: "Royal Tulip Taj Sultan",
      logo: `${REMOTE}/assets/img/tt.png`,
      category: "STRATEGIC",
      websiteUrl: "https://royal-tulip-taj-sultan.goldentulip.com/fr-fr/",
      displayOrder: 1,
    },
    {
      name: "Tunisie Telecom",
      logo: `${REMOTE}/assets/img/LogoTT.png`,
      category: "DIAMOND",
      websiteUrl: "https://www.tunisietelecom.tn/particulier/",
      displayOrder: 2,
    },
    {
      name: "Managers.tn",
      logo: `${REMOTE}/assets/img/manager.png`,
      category: "MEDIA",
      websiteUrl: "https://managers.tn/",
      displayOrder: 3,
    },
    {
      name: "PMI — Project Management Institute",
      logo: `${REMOTE}/assets/img/part.jpg`,
      category: "STRATEGIC",
      websiteUrl: "https://www.pmi.org/",
      descriptionFr:
        "Project Management Institute (PMI) est la principale association professionnelle mondiale dédiée au management de projet. PMI publie le PMBOK® Guide et administre les certifications PMP®, PgMP®, PMI-ACP® et autres.",
      descriptionEn:
        "Project Management Institute (PMI) is the world's leading professional association dedicated to project management. PMI publishes the PMBOK® Guide and administers the PMP®, PgMP®, PMI-ACP® and other certifications.",
      displayOrder: 4,
    },
    {
      name: "FlowUp",
      logo: `${REMOTE}/assets/img/flow.jpg`,
      category: "PARTNER",
      websiteUrl: "http://flowup.tn/",
      displayOrder: 5,
    },
    {
      name: "Talys Digital",
      logo: `${REMOTE}/assets/img/lt.jpg`,
      category: "PARTNER",
      websiteUrl: "https://www.talys.digital/",
      displayOrder: 6,
    },
  ]
  for (const p of partners) {
    await db.partner.create({
      data: {
        eventId: event.id,
        ...p,
        descriptionFr: p.descriptionFr ?? null,
        descriptionEn: p.descriptionEn ?? null,
        isActive: true,
      },
    })
  }
  console.log(`  ✓ ${partners.length} partners`)

  // 9. CMS sections --------------------------------------------------------
  await db.websiteSection.create({
    data: {
      eventId: event.id,
      sectionKey: "HERO",
      titleFr: "Événement international pour les leaders des PMOs",
      titleEn: "International Event for PMO Leaders",
      subtitleFr: "11 – 12 octobre 2025 · Tunis, Tunisie",
      subtitleEn: "October 11–12, 2025 · Tunis, Tunisia",
      descriptionFr:
        "Pendant 2 jours intensifs, vivez une expérience immersive au cœur des meilleures pratiques en management de projets, PMO, conduite du changement, IA et leadership.",
      descriptionEn:
        "For 2 intensive days, experience an immersive journey at the heart of best practices in project management, PMO, change management, AI and leadership.",
      ctaTextFr: "Je m'inscris",
      ctaTextEn: "Register now",
      ctaUrl: "#passes",
      backgroundImage: `${REMOTE}/assets/img/hero/test1.gif`,
      isActive: true,
    },
  })

  await db.websiteSection.create({
    data: {
      eventId: event.id,
      sectionKey: "WHY_PARTICIPATE",
      titleFr: "Pourquoi y participer ?",
      titleEn: "Why participate?",
      descriptionFr:
        "Pendant 2 jours intensifs, vous allez vivre une expérience immersive au cœur des meilleures pratiques en management de projets, PMO, conduite du changement, IA et leadership. Un véritable parcours d'inspiration, d'apprentissage et d'échanges pour accélérer votre impact professionnel et personnel.",
      descriptionEn:
        "For 2 intensive days, you will live an immersive experience at the heart of best practices in project management, PMO, change management, AI and leadership. A true journey of inspiration, learning and exchange to accelerate your professional and personal impact.",
      isActive: true,
      benefits: {
        create: [
          {
            icon: "TrendingUp",
            titleFr: "Explorer les dernières tendances",
            titleEn: "Explore the latest trends",
            descriptionFr: "Outils et méthodes qui façonnent le futur des PMO.",
            descriptionEn: "Tools and methods shaping the future of PMOs.",
            displayOrder: 0,
            isActive: true,
          },
          {
            icon: "Users",
            titleFr: "Capitaliser sur les retours d'expérience",
            titleEn: "Leverage expert feedback",
            descriptionFr: "Auprès d'experts et de dirigeants reconnus.",
            descriptionEn: "From recognized experts and leaders.",
            displayOrder: 1,
            isActive: true,
          },
          {
            icon: "Target",
            titleFr: "Anticiper les évolutions du marché",
            titleEn: "Anticipate market trends",
            descriptionFr: "Et positionner votre organisation comme acteur agile et innovant.",
            descriptionEn: "And position your organization as an agile and innovative player.",
            displayOrder: 2,
            isActive: true,
          },
          {
            icon: "Network",
            titleFr: "Échanger et réseauter",
            titleEn: "Exchange and network",
            descriptionFr: "Avec des professionnels, décideurs et leaders engagés.",
            descriptionEn: "With professionals, decision-makers and engaged leaders.",
            displayOrder: 3,
            isActive: true,
          },
          {
            icon: "Lightbulb",
            titleFr: "Repartir avec des solutions concrètes",
            titleEn: "Leave with concrete solutions",
            descriptionFr: "Des idées, des solutions et une nouvelle énergie pour vos projets.",
            descriptionEn: "Ideas, solutions and new energy for your projects.",
            displayOrder: 4,
            isActive: true,
          },
        ],
      },
    },
  })

  await db.websiteSection.create({
    data: {
      eventId: event.id,
      sectionKey: "ABOUT",
      titleFr: "À propos de PMO Mastery",
      titleEn: "About PMO Mastery",
      descriptionFr:
        "PMO Mastery 2025 se positionne comme un événement de référence qui accompagne la montée en compétences des professionnels, valorise les organisations partenaires et impulse une dynamique d'excellence dans la pratique du PMO en Tunisie et dans la région MENA.",
      descriptionEn:
        "PMO Mastery 2025 positions itself as a benchmark event that supports professionals' skills development, values partner organizations and drives a dynamic of excellence in PMO practice in Tunisia and the MENA region.",
      isActive: true,
    },
  })

  await db.websiteSection.create({
    data: {
      eventId: event.id,
      sectionKey: "FOOTER",
      titleFr: `© ${new Date().getFullYear()} PMO Mastery — Empowerment Paths. Tous droits réservés.`,
      titleEn: `© ${new Date().getFullYear()} PMO Mastery — Empowerment Paths. All rights reserved.`,
      descriptionFr:
        "Mastering PMO 2025 se positionne comme un événement de référence qui accompagne la montée en compétences des professionnels, valorise les organisations partenaires et impulse une dynamique d'excellence dans la pratique du PMO en Tunisie et dans la région MENA.",
      descriptionEn:
        "Mastering PMO 2025 positions itself as a benchmark event that supports professionals' skills development, values partner organizations and drives a dynamic of excellence in PMO practice in Tunisia and the MENA region.",
      isActive: true,
    },
  })
  console.log("  ✓ 4 CMS sections (Hero, Why, About, Footer)")

  console.log("\n✅ Seed complete!")
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`)
  console.log(`   Event: ${event.editionName} (${event.titleFr})`)
  console.log(`   Public site: http://localhost:3000`)
  console.log(`   Admin dashboard: http://localhost:3000/admin`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
