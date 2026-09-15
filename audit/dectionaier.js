document.addEventListener('DOMContentLoaded', function () {
    const langOptions = document.querySelectorAll('.lang-option');
    const translatableElements = document.querySelectorAll('[id]');
     const imagesToSwap = document.querySelectorAll('img[data-lang-img]');

    // Translations for FR and EN
    const translations = {
        'Français': {
          "Nnl1": "♦ Secteur bancaire : entre innovation et contraintes réglementaires",
"Nnl2": "♦ Télécoms et IA : accélérer la performance opérationnelle et la 5G",
"Nnl3": "♦ Rôle du PMO : trouver l’équilibre entre agilité, sécurité et ROI",
          "omrane1": "Ingénieur télécom, titulaire d’un E-MBA et d’un Master en droit des affaires",
"omrane2": "Avec plus de 40 ans d’expérience dans les TIC, il a occupé des postes de direction au Ministère des TIC, chez Tunisie Telecom et ses filiales, avant de rejoindre PwC Tunisie en 2016 comme Senior Advisor.",
"omrane3": "Il a mené de nombreux projets en Afrique du Nord et en Afrique subsaharienne dans les domaines de la stratégie, de la transformation, de l’efficacité opérationnelle et du management de programmes, auprès d’opérateurs, de régulateurs, de gouvernements et d’institutions internationales."
,
          "Naouel1": "Project Management Institute, Mentor Régional MENA",
"Naouel2": "Naouel Ben Zina est une directrice de programme senior avec plus de 20 ans d’expérience dans le domaine des technologies de l’information. Elle a occupé différents postes, notamment des rôles en gestion de projets tels que Chef de projet, Directrice de programme, Directrice de portefeuille, Responsable du PMO & Système Qualité, ainsi que Responsable des opérations. Elle possède une vaste expérience dans la gestion de programmes de grande envergure et complexes, en dirigeant des équipes transverses basées dans la région EMEA.",
"Naouel3": "Elle est diplômée en ingénierie de l’'École Polytechnique de Tunisie'. Elle est certifiée PMP® depuis 2011. Naouel est impliquée dans le chapitre PMI Tunisie depuis son lancement en 2017, d’abord en tant que VP Communication, puis Présidente et Past Présidente. Elle a été nommée Mentor Régional pour la région MENA en juin 2022.",

    "afef1": "Cadre supérieur dans l'industrie des télécommunications",
    "afef2": "Cadre supérieur dans l'industrie des télécommunications, Afef possède un solide bagage technique et managérial. Elle est diplômée de l'École supérieure des communications de Tunis (Sup'Com) et de la Warwick Business School (MBA). Afef a commencé sa carrière auprès d'opérateurs mobiles privés tunisiens, contribuant au lancement d'Ooredoo (anciennement Tunisiana) en 2002 et d'Orange Tunisie en 2010. Elle a dirigé les départements d’ingénierie des produits et services, en impulsant le lancement de services innovants.",
    "afef3": "Elle a dirigé les départements d’ingénierie des produits et services, en impulsant le lancement de services innovants. De 2015 à 2021, Afef a dirigé le laboratoire du Groupe Orange chez Sofrecom Tunisie, promouvant des services mobiles innovants au sein des filiales au Moyen-Orient, en Afrique et en France. Actuellement, elle pilote la stratégie ITN & Data AI Jobline pour le Groupe Orange, avec un focus sur les compétences d’avenir dans l’innovation, incluant le DevOps, la softwarisation des réseaux et l’intelligence artificielle générative. Le rôle d’Afef met en avant la construction de communautés d’experts et la préparation de l’évolution des compétences face aux grandes transformations technologiques.",


          "imenM1": "CEO & Co-founder à Horama Strategic Advisory | Experte en Transformation Digitale & Stratégie",
  "imenM2": "Avec plus de 20 ans d’expérience dans le secteur financier et dans le conseil, Imen Messadi accompagne les institutions dans leur transformation stratégique, marketing et digitale. Elle est actuellement CEO de Horama Strategic Advisory, où elle pilote des missions à fort impact pour des institutions financières et PME. Elle a exercé des fonctions de Directrice Centrale dans le secteur bancaire, où elle a piloté des projets de transformation, de restructuration, de marketing, de développement stratégique et de digitalisation.",
  "imenM3": "Elle agit entre institutions et écosystèmes innovants, transformant les besoins exprimés en solutions concrètes grâce à la collaboration avec les startups et fintechs. Imen combine une expertise stratégique de haut niveau à une forte capacité d’exécution, dans des environnements complexes et en mutation.",

          "aicha1": "Experte RSE & Chef de Projets Développement Durable",
  "aicha2": "Aïcha TAMBOURA-DIAWARA Experte RSE & Chef de Projets Développement Durable. Docteure en Sciences de l'Information et de la Communication avec plus de 22 ans d'expérience, Aïcha TAMBOURA-DIAWARA est une experte reconnue en Responsabilité Sociétale des Entreprises (RSE) et en gestion de projets de développement à fort impact social. Spécialisée dans l'intégration du genre et de l'équité dans les politiques publiques, la durabilité environnementale et la gouvernance participative, elle a dirigé des projets multisectoriels (santé, éducation, mines, agriculture) dans plus de 20 pays en Afrique, Europe et Amérique du Nord.",
  "aicha3": "Son expertise PMO inclut la coordination d'équipes multiculturelles, la mobilisation de fonds, le suivi-évaluation, et la formation en leadership inclusif, avec une expérience terrain significative, où elle a intégré les principes RSE dans tous les aspects du cycle de projet pour maximiser l'impact social et environnemental.",
          'ay1':'Directeur – Plateforme ESG & Développement Durable chez PwC France & Maghreb ',
          'ay2': 'Directeur au sein de la plateforme ESG chez PwC France & Maghreb, Aimen Ktari pilote des missions stratégiques en matière de durabilité et de transformation ESG. ',
          'ay3':"Il joue un rôle actif dans les initiatives RSE et les projets d'accompagnement des entreprises vers une économie ",
          'Mouna0P':'PDG | Facilitatrice en gouvernance d’entreprise | Innovation sociale',


          'Mouna1P':'Entrepreneure engagée et figure reconnue de l’écosystème tunisien, Mouna Chaieb préside aujourd’hui la Commission Économie Numérique de la Chambre de Commerce Internationale (ICC Tunisie), après avoir assuré la présidence nationale du Centre des Jeunes Dirigeants d’Entreprise (CJD Tunisie).Elle est également à la tête d’un cabinet indépendant dédié à la transformation stratégique et humaine des écosystèmes.',
'Mouna2P':'Elle porte une vision humaniste de l’innovation, qu’elle considère comme un levier de souveraineté économique et de cohésion sociale.Experte des enjeux systémiques et éthiques liés à l’intelligence artificielle, elle œuvre à bâtir des passerelles entre technologies émergentes, responsabilité économique et conscience collective.',

'Koundi1':'expert en conseil et management des technologies',
'Koundi2':'Karim Koundi est un expert en conseil et management des technologies, avec plus de 25 ans d’expérience internationale dans les TIC. Ancien CIO de Tunisie Telecom et ex-partner chez Accenture France,',
'Koundi3':'il a rejoint Deloitte en 2013, où il a dirigé les services Advisory pour l’Afrique centrale avant d’être nommé en 2022 Country Managing Partner de Deloitte Tunisie et membre du comité exécutif Afrique francophone. Il a conseillé gouvernements et entreprises, notamment en Afrique, sur la stratégie et la transformation digitale.',
'koundiP':'Associé-gérant pays Tunisie & Responsable Industrie TMT Afrique francophone',
          'par3F':'Partenaire Diamond',
          'par4F':'Partenaire Média',
          "chinkwa":"pass duo",
          "OP1":"nos pass",
          "Programme":"Programme",

  "hr11": "CEO Excellia Leadership – Coach ICF – Manager de Transition",
  "hr12": "Leader visionnaire et figure emblématique du management en Tunisie, Henda Essafi Rekik cumule plus de 30 ans d’expérience à la tête d’organisations industrielles internationales (COFAT, Marquardt, Henkel, Faurecia, Amphenol, Valeo…). Lauréate du prix Femme Manager de Tunisie 2018 (1ère Édition), elle excelle dans la conduite de transformations stratégiques, la gestion de crises et le management de transition.",
  "hr13": "Coach certifiée ICF et praticienne Prosci® en conduite du changement, elle accompagne les entreprises et dirigeants dans leurs transitions organisationnelles et culturelles, en insufflant leadership, agilité et innovation.",


  "NZim1": "Directeur des PMO et de la Transformation - Zitouna Bank - Modérateur de Panel",
  "NZim2": "Directeur des PMO et de la Transformation - Zitouna Bank - Modérateur de Panel<br>Nazir apporte plus de 20 ans d’expérience dans les secteurs financier et technologique. Il a débuté sa carrière à la \"Banque du Sud\" (aujourd’hui \"Attijari Bank\"), où il s’est spécialisé dans les services financiers et l’ingénierie logicielle. Tout au long de sa carrière, il a développé une expertise solide dans la conduite de programmes de transformation, le soutien à l’excellence opérationnelle, la structuration des PMO et les initiatives de gestion du changement.",
  "NZim3": "Actuellement Directeur des PMO et de la Transformation à \"Zitouna Bank\", Nazir a joué un rôle clé dans l’amélioration de la maturité des PMO et leur alignement avec la croissance globale de la banque, son évolution numérique et sa feuille de route de transformation agile. Parmi ses atouts figurent la mise en place de PMO, le déploiement de méthodologies de gestion de projets, la direction d’initiatives de transformation stratégique et la mise en œuvre d’outils au niveau de l’entreprise. Il est également reconnu pour ses compétences efficaces en collaboration interfonctionnelle et en facilitation de planification.<br>Avant Zitouna Bank, il a occupé le poste de Senior Project Manager chez Wevioo, où il a géré avec succès des projets informatiques complexes avec des équipes pluridisciplinaires. Nazir est également un contributeur actif au sein de la communauté, ayant servi en tant que VP Finance du chapitre tunisien du PMI de 2019 à 2023, après y avoir adhéré en 2018.",

          'smiU1': 'Professeur en psychologie cognitive et conseiller stratégique',
   'smiU2': 'professeur en psychologie cognitive et conseiller stratégique, cumule plus de 27 ans d’expérience à l’interface entre recherche, innovation et transformation organisationnelle. Fondateur du iLab@NAUSS, il conçoit des outils et systèmes intelligents (détection des comportements à risque, suivi de la résilience, reconnaissance émotionnelle) au service de la performance des projets et des équipes.',
   'smiU3': 'Conseiller auprès de l’UNODC, l’IOM et l’UNOCT, il pilote des projets liés à la résilience des jeunes, à la prévention de la radicalisation et à l’innovation technologique (biométrie, leadership, intelligence émotionnelle). Lauréat de plusieurs prix (Excellence académique 2025, E-learning 2024), il est reconnu pour sa vision systémique, son leadership collaboratif et sa capacité à transformer la complexité en solutions concrètes pour les PMO.',
          'emiU1': 'experte en transformation, auteure et conférencière',
  'emiU2': 'est une experte en transformation avec plus de 15 ans d\'expérience dans le conseil aux conseils d\'administration et dirigeants, la gestion d\'équipes pluridisciplinaires et la conduite de projets transformationnels.',
  'emiU3': 'Elle détient plusieurs distinctions pionnières : première femme bahreïnie certifiée PMI-PfMP, première bahreïnie certifiée SIP et première diplômée en ESG (CGI).\n\nPrimée à plusieurs reprises, elle a été élue #1 Femme Leader en Gestion de Projet (GPMF 2024), a reçu le prix AACE de la Femme Exceptionnelle en Contrôle de Projets, le PowerList Middle East Award et une médaille de bronze Women Changing the World. Elle est également auteure et conférencière.',
          'time1':'08:30  – 15:30',
          'time2':'08:30 – 15:30',
          'time3':'08:30 – 15:30 ',
          'time4':'08:30 – 15:30 ',
          'time5':'13:00 – 14:15',
          'time6':'14:30 – 14:50',
          'time7':'15:00 – 15:50',
          'time8':'16:00 – 16:30',
          'time9':'16:30',
          'faqU17':'PASS ÉVÉNEMENT + 4 FORMATIONS',
          'up1':"J'ai un code promo",
          'up2':"Vérifier",
          "up3":"Retour au site",
          "up5":"Inscription avec paiement",
          "up6":"inscription sans paiement",
          "up10":"Confirmation d'inscription",
          "up11":"Votre inscription à l’événement a bien été enregistrée !",
          "up12":"Nous vous contacterons prochainement par téléphone pour confirmer votre participation.",
          "up10B":"Informations Client",
          "up13":"Nom",
          "up14":"Email",
          "up15":"Téléphone",
          "up16":"Code promo",
          "up17":"Pass choisis",
          "up18":"Aucun pass sélectionné.",
          "up19":"Référence",
          "up20":"Retour à l'accueil",
          "up21":"Imprimer cette page",
          "lup1":"Choisir la méthode de paiement",
          "lup2":"Veuillez choisir votre méthode de paiement :",
          "lup3":"Carte bancaire",
          "lup4":"Virement bancaire",
          "vipU1": "Confirmation de Commande",
    "vipU2": "Veuillez effectuer votre virement selon les instructions ci-dessous",
    "vipU3": "Informations Client",
    "vipU4": "Nom complet",
    "vipU5": "Email",
    "vipU6": "Téléphone",
    "vipU6b": "Code promotionnel",
    "vipU7": "Pass choisis",
    "vipU8": "Aucun pass sélectionné.",
    "vipU9": "Montant total à payer",
    "vipU10": "Coordonnées Bancaires Depuis la Tunisie",
    "vipU11": "Banque",
    "vipU12": "(STB) - Société Tunisienne de Banque",
    "vipU13": "Nom : Empowerment Paths",
    "vipU14": "Numéro de compte",
    "vipU15": "Libellé du virement",
    "vipU16": "Important :",
    "vipU17": "Veuillez inclure exactement le libellé ci-dessus pour faciliter le traitement de votre paiement.",
    "vipU18": "Coordonnées Bancaires Depuis l’étranger",
    "vipU19": "Banque",
    "vipU20": "Attijari Banque",
    "vipU21": "Nom : Empowerment Paths",
    "vipU22": "Numéro de compte",
    "vipU23": "Libellé du virement",
    "vipU24": "Important :",
    "vipU25": "Veuillez inclure exactement le libellé ci-dessus pour faciliter le traitement de votre paiement.",
    "vipU26": "Retour à l'accueil",
    "vipU27": "Imprimer cette page",
    "imiU1": "Experte & Influenceuse PMO et auteure de livre",
"imiU2": "Heba AlShehhi est une influenceuse PMO, une conférencière publique, une conférencière TED Talk et la World PMO Leader de l’année 2023. Elle est responsable du PMO d'une entité gouvernementale à Dubaï et travaille bénévolement pour le PMI en tant que responsable du PMOGA MENA Hub.",
"imiU3": "Avec près de vingt ans d'expérience dans le leadership gouvernemental, Heba a conduit ses équipes à de multiples récompenses mondiales. Elle est l'auteur de ‘’Elements of Leadership’’, un guide de leadership inspiré par la nature qui redéfinit la confiance, l'empathie et l'objectif dans les organisations modernes. Son travail fait le lien entre la stratégie et l'âme et entre la performance et les personnes.",
"imiU4": "Pays",
"imiU5": "Tunis, Tunisie",









            'n1': 'Accueil',
            'n2': 'Événement',
            'n3': 'Événement',
            'n4': 'AGENDA',
            'n5': 'Intervenants',
            'n6': 'Organisateurs & Partenaires',
            'n7': 'Organisateurs',
            'n8': 'Partenaires',
            'n9': 'Contact',
            'f0': 'Tunis,TUNISIE',
            'f1': 'Liens rapides',
            'f2': 'À propos de cet événement',
            'f3': 'Intervenants',
            'f4': 'AGENDA',
            'f5': 'Partenaires',
            'f6': 'Obtenez vos pass',
            'f7': 'Contactez-nous',
            'f8': "Mastering PMO 2025 se positionne comme un événement de référence qui accompagne la montée en compétences des professionnels, valorise les organisations partenaires, et les engage durablement vers l’excellence opérationnelle, en proposant des solutions adaptées aux réalités économiques de la Tunisie et de la région.",
            'f9': "Copyright © 2025 Dasinformatique.com Tous droits réservés.",
            "i1": "Acheter un pass",
"i2": "Événement international pour les leaders des PMOs",
"i3": "hammamet - TUNISIE",
"i4": "Je m’inscris",
"i5": "Pourquoi y participer ?",
"i6": "Pendant 2 jours intensifs, vous allez vivre une expérience immersive au cœur des meilleures pratiques en management de projets, PMO, conduite du changement, IA et leadership.",
"i7": "Un véritable parcours d'inspiration, d’apprentissage et d’échanges pour accélérer votre impact professionnel et personnel.",
"i8": "Explorer les dernières tendances, outils et méthodes qui façonnent le futur des PMO.",
"i9": "Capitaliser sur les retours d’expérience d’experts et de dirigeants reconnus.",
"i10": "Anticiper les évolutions du marché et positionner votre organisation comme un acteur agile et innovant.",
"i11": "Échanger et réseauter avec des professionnels, décideurs et leaders engagés.",
"i12": "Repartir avec des idées, des solutions et une nouvelle énergie pour vos projets et vos équipes.",
"i13": "L’événement qui propulse les bureaux des projets (PMO) vers l’excellence opérationnelle et stratégique",
"i14": "Échangez en direct avec des leaders et experts reconnus",
"i15": "Créez de nouvelles opportunités d'affaires",
"i16": "Gagnez en expertise stratégique",
"i17": "Le PMO du Futur : Stratégie, IA et Performance",
"i18": "Les Voix Qui Façonnent l'Avenir",
"i19": "Ils Inspirent, Ils Transforment",
"i20": "Plus de détails",
"i21": "Programme détaillé de l'événement",
"i22": "Langues:",
"i23": "Arabe",
"i24": "Français",
"i25": "Français",
"i26": "Français",
"i27": "Thématiques:",
"i28": "PMO Hybride et Pilotage de performance : Intégrer Agilité, Traditionnel et KPIs pour un PMO Performant",
"i29": "Aligner, Agir, Réussir : L’Agilité au Service de la Stratégie aux KPI jusqu’à l’Exécution Agile",
"i30": "Optimisez votre performance projet avec les outils d’intelligence artificielle du PMI",
"i31": "Détails",
"i32": "Langues:",
"i33": "Arabe",
"i34": "Français",
"i35": "Anglais",
"i37": "Session plénière 1 : Excellence des bureaux des projets (PMO) et Création de Valeur",
"i38": "Session plénière 2 : IA & Prise de desicion",
"i39": "Session plénière 3 : Leadership & Changement : Convergence IA, Humain et Transformation",
"i39Y":"Session plénière 1   :  IA et transformation sectorielle : secteur bancaire & télécom",
"i40Y":"Session plénière 5   : ESG et RSE – Un duo stratégique pour des projets responsables et durables",

"i40": "Détails",
"i41": "Le PMO du Futur : Stratégie, IA et Performance",
"i42": "Obtenez l'itinéraire vers la salle de l'événement",
"i43": "Lieu",
"i44": "Cette première édition sera organisée à Tunis",
"i45": "Adresse",
"i46": "Tunis, Tunisie",
"i47": "Obtenez l'itinéraire",
"i48": "Nos partenaires de la 1ère édition 2025",
"i49": "Rencontrez nos partenaires",
"i50": "Partenaires stratégiques",
"i51": "Plus de détails",
"i52": "EXPLOREZ NOS PLANS TARIFAIRES",
"i53": "plus de détails",
"i54": "Collaboration",
"i55": "Partage",
"i56": "Apprentissage",
"i57": "Expertise",
"i58": "plus de détails",
"i60": "plus de détails",
"i61": "Le PMO du Futur : Stratégie, IA et Performance",
"e1": "PMO MASTERY",
 "e2": "Programme Unique",
 "e3": "Découvrez une première édition audacieuse",
 "ef1":"•	Un agenda 100% orienté 'Future of PMOs' : IA, création de valeur et leadership 2030.",
 "ef2":"•	panels stratégiques + keynotes exclusives (dont des lauréats des PMOGA Awards).",
 "ef3":"•	Des sessions de formation dynamiques pour tous les profils (Juniors à Experts).",

 "e4": "Speakers Prestigieux",

 "e5": "Des experts influents et des leaders visionnaires",
    "ef4": "• Intervenants internationaux (lauréats PMOGA, chercheurs académiques/PMI).",
    "ef5": "• CEO, DSI, PMO et décideurs de grandes entreprises partageant leurs success stories.",
    "ef6": "• Accès direct aux intervenants, aux méthodologies et à des retours d'expérience concrets.",
 "e6": "Maximisez votre ROI relationnel",
 "ef5": "• Rencontrez 150+ professionnels (PMO, DSI, consultants seniors).",
   "ef6": "• Sessions dédiées (speed-meetings, stratégiques, pauses café interactives).",
   "ef7": "• Accès à des groupes d'experts dédiés.",
 "e7": "Votre agenda pour ne manquer aucun rendez-vous stratégique",
 "e8": "Jour-01",
 "e9": "Formation",
 "e10": "Jour-02",
 "e11": "Langue",
 "e12": "Arabe",
 "e13": "PMO Hybride et Pilotage de performance: Intégrer Méthode agile, Traditionnel et KPI pour un PMO Performant",
 "e14": "Pour être efficace, un PMO doit allier flexibilité et rigueur. Orienté résultats, le bureau des projets doit s'adapter aux différentes méthodologies de gestion de projet tout en maintenant un suivi précis des performances.",
 "e15": "Langue",
 "e16": "Francais",
 "e17": "De la Stratégie aux KPI jusqu’à l’Exécution Agile",
 "e18": "Dans un environnement marqué par l’incertitude et la rapidité des changements, de nombreuses organisations échouent non pas dans la formulation de leur stratégie, mais dans son exécution. Les KPI jouent un rôle essentiel pour transformer les objectifs stratégiques en résultats mesurables et pilotables. L’approche agile vient renforcer cette dynamique en offrant flexibilité, rapidité d’adaptation et amélioration continue dans le management de la stratégie.",
 "e19": "Langue",
 "e20": "Francais",
 "e21": "L’IA permet ainsi aux chefs de projet et aux PMO de se concentrer davantage sur les aspects stratégiques et humains de leurs missions, en s’appuyant sur des outils puissants pour le pilotage et l’anticipation.",
 "e22": "Langue",
 "e23": "Francais",
 "e24": "Accueil et petit-déjeuner de réseautage",
 "e25": "Participez à un moment convivial d'inscription dans une ambiance détendue. Profitez d'un délicieux petit-déjeuner pour échanger et faire de nouvelles rencontres.",
 "e26": "Mot de bienvenue et ouverture",
 "e27": "Discours de bienvenue de l'hôte de la conférence, Mot d’accueil suivi du mot d’ouverture et présentation de l'agenda de la journée et les thèmes clés.",
 "e28": "Session Plénière 1 : Excellence des bureaux des projets (PMO) et Création de Valeur",
 "e29": "Keynote 1: Excellence des bureaux des projets (PMOs)",
 "e30": "Comment les PMO peuvent piloter la transformation business.",
 "e31": "Panel de Discussion 1 : PMO stratégiques : Passer de la gestion à la création de Valeur",
"e31I":"Panel de Discussion 2 (Session parallèle) : PMO et RSE – Un duo stratégique pour des projets responsables et durables",
"e32I":"♦ Intégrer le RSE dans la gouvernance projet : Comment le PMO peut-il devenir un acteur clé ?",
"e33I":"♦	PMO et projets de transformation durables : étude de cas",
"e34I":"♦ Collaboration PMO – Institutions publiques - ONG en Tunisie pour des projets à fort impact",
"e32II":'♦ Diriger avec vision "Commencer par le pourquoi"',
"e33II":'♦ Modèles concrets : quand les PMO deviennent des centres de revenus ',
"e34II":'♦ Alignement des projets avec la stratégie business ',
"e35II":"♦ ROI du PMO : les métriques parlantes pour les décideurs",





"Pause_Cafe":"Pause Café ",
 "e33": "Pause Café & Networking",
 "e34": "SESSION PLENIERE 2 : IA & PRISE DE DECISION",
 "e35": "Keynote 2  : L'information : la force vitale d'un PMO",
 "e36": "",
 "e37": "Panel de discussion 2: Comment l'IA redéfinit les règles des PMO (Data/Prise de décision)",
 "e38": "L'IA au cœur des opérations PMO. Du Big Data aux bonnes décisions. Cyber-résilience des portefeuilles.",
 "e40": "Études de cas : concilier sécurité et agilité, un défi opérationnel",
 "e43": "Déjeuner & Networking",
 "e44": "SESSION PLENIERE 3 : LEADERSHIP & CHANGEMENT: CONVERGENCE IA, HUMAIN ET TRANSFORMATION",
 "e45": "Dynamiser le côté humain des PMO",
 "e46": "Explorez comment les leaders visionnaires surmontent les résistances au changement.Découvrez leurs stratégies pour transformer les obstacles en opportunités et mobiliser l'adhésion autour de leurs initiatives.",
 "e47": "Panel de discussion 3: Synergie Gagnante: Conduite du changement et IA au service des bureaux de gestion de projets.",
 "e48": "Naviguer les transitions digitales et culturelles. Leadership humain dans un monde piloté par l'IA. Renforcer l'engagement des sponsors dans la conduite du Changement.",
 "e49": "Keynote de Clôture: Le PMO en 2030 - Quel avenir pour les PMOs?",
 "e50": "Future des PMO: Tendances mondiales et régionales clés. Et si Darwin avait raison ? S'adapter ou disparaître ? Synthèse des points clés.",
 "e51": "Clôture de l'évènement",
 "e52": "Le PMO du Futur : Stratégie, IA et Performance",
 "e53": "EXPLOREZ NOS PLANS TARIFAIRES",
 "g1": "AGENDA  de l'Événement",
  "g2": "AGENDA ",
  "g3": "Bientôt disponible",
  "t1": "Nos Intervenants",
   "t2": "Les Voix Qui Façonnent l'Avenir",
   "t3": "Des experts, des leaders d'opinion et des professionnels",
    "or1": "Organisateurs",
    "or2": "Dirigé par Mme",
    "or3": ", PgMP®, PMP®, PMO-CP, Coach Professionnelle. Empowerment Paths est un cabinet ATP de conseil et de développement professionnel qui accompagne les organisations dans la conception, la mise en place et l’optimisation de leurs PMOs pour renforcer l’alignement stratégique, la visibilité des portefeuilles et la création de valeur.",
    "or4": "Actif dans des secteurs variés, nous proposons des solutions sur-mesure autour de trois pôles :",
    "or5": "🔹 Conseil – PMO, évaluation de maturité, modèles opérationnels et conduite du changement via des projets de transformation",
    "or6": "🔹 Formation – en gestion de projet (PMP®, PgMP®), excellence PMO, agilité, soft skills, leadership",
    "or7": "🔹 Coaching exécutif & d’équipe – pour renforcer la performance individuelle, collective et managériale",
    "or8": "MEMBRE DU COMITÉ",
    "or9": "DES JUGES",

    "par1": "Nos partenaires",
    "par2": "Partenaires Stratégiques",
    "par3": "Project Management Institute (PMI) est la principale association professionnelle au monde pour une communauté mondiale croissante de millions de professionnels de la gestion de projet et d’agents de changement à travers le globe.",
    "par4": "En tant que principale autorité mondiale en gestion de projet, PMI donne aux individus les moyens de transformer leurs idées en réalité. Grâce à son plaidoyer mondial, ses réseaux, ses collaborations, ses recherches et son offre éducative, PMI prépare les organisations et les individus à chaque étape de leur parcours professionnel à travailler de manière plus intelligente, afin qu'ils puissent réussir dans un monde en constante évolution. S'appuyant sur un héritage prestigieux remontant à 1969, PMI est une organisation à but non lucratif présente dans presque tous les pays du monde. Elle œuvre pour faire progresser les carrières, renforcer le succès des organisations et donner aux agents de changement de nouvelles compétences et méthodes de travail pour maximiser leur impact. Les offres de PMI incluent des normes reconnues mondialement, des certifications, des cours en ligne, des outils, des publications numériques, du leadership éclairé et des communautés.",
    "par5": "Partenaires",
    "co1": "Prenez contact avec nous",
    "co2": "Contactez-nous",
    "co3": "J'accepte la politique de confidentialité",
    "co4": "Envoyer",
    "pass1": "Rejoignez-nous",
    "pass2": "L’événement qui propulse les bureaux des gestions de projets (PMO) vers l’excellence opérationnelle et stratégique. Compétences, influence et performance au service de la transformation.",
    "pass3": "Découvrez nos Pass, conçus pour vous offrir une expérience inégalée.",
    "pass4": "Accédez aux zones exclusives, profitez de privilèges et vivez des événements comme jamais auparavant.",
    "pass5": "Obtenez votre pass",
    "mo1": "Leader Global PMO et Transformation Agile | Top 8 des influenceurs PMO (PMO Global Awards 2021) | Plus de 25 ans d'expérience en gestion stratégique de projets dans plus de 8 pays | Certifié PMP, PgMP, PMI-ACP | Conférencier et Mentor.",
    "mo2": "Mohamed Khalifa est un expert mondialement reconnu en gestion de projets, mise en œuvre des bureaux de projet et transformation digitale, avec plus de 25 ans d'expérience dans les secteurs de l'informatique, de la banque, du pétrole et gaz, des télécommunications et du gouvernement. En tant que consultant PMO, il se spécialise dans la planification stratégique, la transformation Agile et l'optimisation des PMO.",
    "mo3": "Mohamed Khalifa a géré avec succès des projets aux États-Unis, au Royaume-Uni, au Moyen-Orient et au-delà. Il est un conférencier très demandé, ayant présenté lors de plus de 300 événements, y compris les congrès mondiaux du PMI. Il détient plus de 20 certifications, notamment PMP, PgMP et PMI-ACP, et a été nommé parmi les 8 meilleurs influenceurs PMO au monde par les PMO Global Awards (2021).",
    "kh1": "CEO de Bahri Group",
    "kh2": "Depuis 1993 avec EPPM, Monsieur BAHRI a acquis une vaste expérience en tant que Directeur de Projet pluridisciplinaire dans les domaines de l’environnement, du pétrole et gaz, de l’énergie, des cimenteries et de l’industrie chimique. Monsieur BAHRI a notamment assuré la direction du projet pour le management, l’ingénierie et la construction d’une plateforme offshore et d’un pipeline onshore et offshore de 6” – 36 km – reliant Kherkenah à Sfax en Tunisie pour le compte de TBS (TPS). Il a également dirigé et participé, en tant que directeur de projet ou expert en électromécanique, à de nombreux projets dans le domaine de l’environnement avec l’ONAS (réalisation de 13 STEP et d’une centaine de stations de pompage), avec la SONEDE (réalisation de stations de surpression) et avec la CRDA (réalisation de 3 périmètres irrigués).",
    "kh3": "Il a été également Directeur de projet dans différents secteurs. Formateur PMP, Expert en communication des projets du cadre bâti, Instructeur partenaire de formation autorisé PMP, PMI-CP®, PMI-SCP®, Praticien certifié en gestion du changement Prosci®.",
    "kh4": "Pays",
    "im1": "Présidente de PMITC",
    "im2": "Ingénieure en télécommunications et titulaire d’un Master. Avec plus de 17 ans d’expérience, elle a travaillé dans l’installation de réseaux mobiles chez Tunisie Telecom, la recherche sur les réseaux à l’INRS-EMT pour Bell Canada, et a occupé divers postes de direction en gestion de projets, notamment des postes seniors au sein d’entreprises multinationales en informatique et télécommunications.",
    "im3": "Elle possède une vaste expérience dans la gestion de grands projets transversaux en Afrique, en Europe, en Amérique latine et en Asie. Actuellement, Imen est la directrice d’ICF Management Services, offrant des services de conseil et de formation à l’échelle mondiale pour les projets IT/Télécom. Professionnelle certifiée PMP® depuis 2011, elle est une bénévole active de PMITC depuis 2016, élue VP de la Communication et du Marketing en 2020, et Présidente depuis mai 2023.",
    "yos1": "Organizateur",
  "faq1": "Finaliser Votre Inscription",
  "faq2": "Informations personnelles",
  "faq3": "Nom et prénom",
  "faq4": "Adresse e-mail",
  "faq5": "Nom de l'organisation/entreprise/université",
  "faq6": "Pays",
  "faq7": "Sélectionnez un pays",
  "faq8": "Vos Pass",
  "faq9": "PASS ÉVÉNEMENT",
  "faq10": "PASS INDIVIDUEL",
  "faq11": "PASS ÉQUIPE",
  "faq12": "PASS ÉTUDIANT",
  "faq13": "PASS FORMATION",
  "faq14": "PASS FORMATION",
  "faq15": "PASS ÉVÉNEMENT + 1 FORMATION",
  "faq16": "PASS ÉVÉNEMENT + 2 FORMATIONS",
  "faq17": "PASS ÉVÉNEMENT + 3 FORMATIONS",
  "faq18": "Une Valeur Qui Transforme",
  "faq19": "Total Commande",
  "faq20": "Code Promo",
  "faq21": "Télephone",
  "indF1": "Jour",
  "indF2": "Heure",
  "indF3": "Minute",
  "indF4": "Seconde",
  "e38YY":"♦AI au cœur de la transformation",
  "e39YY":"♦Du Big Data aux bonnes décisions",
  "e40YY":"♦Cyber-résilience des portefeuilles",
  "e48YYY":"♦Naviguer les transitions digitales et culturelles",
  "e49YYY":"♦Distributed Leadership and Emotional Intelligence in the Age of AI",
  "e50YYY":"♦Sponsorship et parties prenantes : transformer l’implication des décideurs en véritable catalyseur de performance.",



      "e51YYYY":"♦Future des PMO: Tendances mondiales et régionales clés",
      "e52YYYY":"♦Et si Darwin avait raison ? S'adapter ou disparaître ?",
      "e53YYYY":"♦Synthèse des points clés"













        },
        'English': {
          'time1':'08:30 – 03:30 PM',
          'time2':'08:30 – 03:30 PM',
          'time3':'08:30 – 03:30 PM',
          'time4':'08:30 – 03:30 PM',
          'time5':'01:00 PM – 02:15 PM',
          'time6':'02:30 PM – 02:50 PM' ,
          'time7':'03:00 PM – 03:50 PM',
          'time8':'04:00 PM – 04:30 PM',
          'time9':'04:30 PM',
          "Programme":"Program",









            'n1': 'Home',
            'n2': 'Event',
            'n3': 'Event',
            'n4': 'diary',
            'n5': 'Speakers',
            'n6': 'Organizers & Partners',
            'n7': 'Organizers',
            'n8': 'Partners',
            'n9': 'Contact',
            'f0': 'Tunis, TUNISIA',
            'f1': 'Quick Links',
            'f2': 'About this Event',
            'f3': 'Speakers',
            'f4': 'diary',
            'f5': 'Partners',
            'f6': 'Get Your Passes',
            'f7': 'Contact Us',
            'f8': "Mastering PMO 2025 positions itself as a benchmark event that enhances professionals' skills, values partner organizations, and sustainably engages them towards operational excellence by offering solutions tailored to the economic realities of Tunisia and the region.",
            'f9': "Copyright © 2025 Dasinformatique.com All rights reserved.",
            "i1": "Buy a pass",
    "i2": "International event for PMO leaders",
    "i3": "hammamet - TUNISIA",
    "i4": "Register now",
    "i5": "Why participate?",
    "i6": "Over two intensive days, you will have an immersive experience with best practices in project management, PMO, change management, AI, and leadership.",
    "i7": "A journey of inspiration, learning, and networking to accelerate your professional and personal impact.",
    "i8": "Explore the latest trends, tools, and methods shaping the future of PMOs.",
    "i9": "Leverage insights from experts and recognized leaders.",
    "i10": "Anticipate market changes and position your organization as agile and innovative.",
    "i11": "Network with professionals, decision-makers, and committed leaders.",
    "i12": "Leave with ideas, solutions, and new energy for your projects and teams.",
    "i13": "The event that propels project management offices (PMOs) towards operational and strategic excellence",
    "i14": "Engage directly with recognized leaders and experts",
    "i15": "Create new business opportunities",
    "i16": "Gain strategic expertise",
    "i17": "The Future PMO: Strategy, AI, and Performance",
    "i18": "Voices Shaping the Future",
    "i19": "They Inspire, They Transform",
    "i20": "More details",
    "i21": "Detailed event program",
    "i22": "Languages:",
    "i23": "Arabic",
    "i24": "French",
    "i25": "French",
    "i26": "Frensh",
    "i27": "Topics:",
    "i28": "Hybrid PMO and Performance Management: Integrating Agility, Traditional, and KPIs for a High-Performing PMO",
"i29": "Align, Act, Succeed: Agility at the Service of Strategy, from KPIs to Agile Execution",
    "i30": "Optimize your project performance with PMI’s artificial intelligence tools.",
    "i31": "Details",
    "i32": "Languages:",
    "i33": "Arabic",
    "i34": "French",
    "i35": "English",
    "i37": "PANEL SESSION 1: PMO EXCELLENCE AND VALUE CREATION",
    "i38": "PANEL SESSION 2: AI & Decision-Makers",
    "i39": "PANEL SESSION 3: LEADERSHIP & CHANGE: CONVERGENCE OF AI, HUMAN, AND TRANSFORMATION",
    "i39Y":"PANEL SESSION 1: AI and Sectoral Transformation: Banking & Telecom Sector",

  "Nnl1": "♦ Banking sector: between innovation and regulatory constraints",
  "Nnl2": "♦ Telecoms and AI: accelerating operational performance and 5G",
  "Nnl3": "♦ Role of the PMO: finding the balance between agility, security, and ROI",
    "i40Y":"PANEL SESSION 5: ESG and CSR : A Strategic Duo for Responsible and Sustainable Projects",
    "i40": "Details",
    "i41": "The Future PMO: Strategy, AI, and Performance",
    "i42": "Get directions to the event venue",
    "i43": "Venue",
    "i44": "This first edition will be hosted in Tunis",
    "i45": "Address",
    "i46": "Tunis, Tunisia",
    "i47": "Get directions",
    "i48": "Our partners for the 1st edition 2025",
    "i49": "Meet our partners",
    "i50": "Strategic partners",
    "i51": "More details",
    "i52": "EXPLORE OUR PRICING PLANS",
    "i53": "more details",
    "i54": "Collaboration",
    "i55": "Sharing",
    "i56": "Learning",
    "i57": "Expertise",
    "i58": "more details",
    "i60": "more details",
    "i61": "The Future PMO: Strategy, AI, and Performance",
  "e1": "PMO MASTERY",
  "e2": "Unique Program",
  "e3": "Discover a bold first edition",
  "ef1":"•  A 100% Future-Oriented PMO Agenda: AI, Value Creation, and Leadership for 2030.",
  "ef2":"•	Strategic Panels and Exclusive Keynotes (including PMOGA Awards winners).",
  "ef3":"•	Dynamic training sessions for all levels (from Juniors to Experts).",
  "e4": "Prestigious Speakers",
  "e5": "Influential experts and visionary leaders",
"ef4": "• International speakers (PMOGA award winners, academic researchers/PMI).",
"ef5": "• CEOs, CIOs, PMOs, and decision-makers from major companies sharing their success stories.",
"ef6": "• Direct access to speakers, methodologies, and concrete feedback.",
  "e6": "Maximize your relational ROI",
  "ef5": "• Meet 150+ professionals (PMOs, CIOs, senior consultants).",
"ef6": "• Dedicated sessions (speed-meetings, strategic discussions, interactive coffee breaks).",
"ef7": "• Access to dedicated expert groups.",
  "e7": "Your agenda to not miss any strategic appointments",
  "e8": "Day-01",
  "e9": "Masterclasses",
  "e10": "Day-02",
  "e11": "Language",
  "e12": "Arabic",
  "e13": "Hybrid PMO and Performance Management: Integrating Agile Methods, Traditional Approaches, and KPI for a High-Performing PMO",
  "e14": "To be effective, a PMO must combine flexibility and rigor. Results-oriented, the project office must adapt to different project management methodologies while maintaining precise performance tracking.",
  "e15": "Language",
  "e16": "French",
  "e17": "From Strategy to KPIs to Agile Execution",
"e18": "In an environment marked by uncertainty and rapid change, many organizations fail not in formulating their strategy but in executing it. KPIs play an essential role in transforming strategic objectives into measurable and manageable results. The agile approach reinforces this dynamic by providing flexibility, adaptability, and continuous improvement in strategy management.",
  "e19": "Language",
  "e20": "French",
  "e21": "AI allows project managers and PMOs to focus more on the strategic and human aspects of their missions, relying on powerful tools for management and anticipation.",
  "e22": "Language",
  "e23": "French",
  "e24": "Welcome, Registration and Networking",
  "e25": "Participate in a friendly registration moment in a relaxed atmosphere. Enjoy a delicious breakfast to connect and make new contacts.",
  "e26": "Welcome and opening remarks",
  "e27": "Welcome address by the conference host, welcome remarks followed by opening remarks and presentation of the day's agenda and key themes.",
  "e28": "Plenary Session 1: Project Management Office (PMO) Excellence and Value Creation",
  "e29": "Keynote 1: Excellence in Project Management Offices (PMOs)",
  "e30": "How PMOs can drive business transformation.",
  "e31": "Discussion Panel 1 : Strategic PMO: Shifting from Management to Value Creation",
  "e31I":"Discussion Panel 2 (Parallel Session): PMO and RSE – A Strategic Duo for Responsible and Sustainable Projects",
  "e32I":"♦ Integrating RSE into Project Governance: How Can the PMO Become a Key Player?",
  "e33I":"♦ PMO and Sustainable Transformation Projects: Case Studies",
  "e34I":"♦ PMO Collaboration with Public Institutions and NGOs in Tunisia for Impactful Projects",

  "e32II":'♦ Lead with Vision: "Start with Why"',
  "e33II":"♦ Concrete Models: When PMOs Become Revenue Centers",
  "e34II":"♦ Project Alignment with Business Strategy",
  "e35II":"♦ PMO ROI: Meaningful Metrics for Decision Makers",
  "Pause_Cafe":"Coffee Break ",
    "e33": "Coffee Break & Networking",
  "e34": "PLENARY SESSION 2: AI & DECISION MAKING",
  "e35": "Keynote 2 : Information: The Lifeblood of a PMO",
  "e36": "",
  "e37": "Panel Discussion 2: From Data to decision: How AI is redefining PMO rules",
  "e38": "AI at the heart of PMO operations. From Big Data to informed decisions. Cyber resilience of portfolios.",
  "e40": "Case studies: balancing security and agility, an operational  challenge",
  "e43": "Lunch & Networking",
  "e44": "PANEL SESSION 3: LEADERSHIP & CHANGE: CONVERGENCE OF AI, HUMAN, AND TRANSFORMATION",
  "e45": "The Fire Factor: Energizing the Human Side of PMOs",
  "e46": "Explore how visionary leaders overcome resistance to change. Discover their strategies to turn obstacles into opportunities and mobilize adherence around their initiatives.",
  "e47": "Panel Discussion 3: Winning Synergy: Change Management and AI in Service of Project Management Offices",
  "e48": "Navigating digital and cultural transitions. Human leadership in an AI-driven world. Strengthening sponsor engagement in Change Management.",
  "e49": "Closing Keynote: The PMO in 2030 - What's Next for PMOs?",
  "e50": "The Future of PMOs: Key Global and Regional Trends. What if Darwin was right? Adapt or disappear? Key points summary.",
  "e51": "Closing of the Event",
  "e52": "The Future PMO: Strategy, AI, and Performance",
  "e53": "EXPLORE OUR PRICING PLANS",
  "g1": "Event diary",
"g2": "diary",
"g3": "Coming Soon",
"t1": "Our Speakers",
    "t2": "The Voices Shaping the Future",
    "t3": "Experts, thought leaders, and professionals",
    "or1": "Organizers",
    "or2": "Led by Ms.",
    "or3": ", PgMP®, PMP®, PMO-CP, Professional Coach Empowerment Paths is a consulting and professional development firm that supports organizations in designing, implementing, and optimizing their PMOs to strengthen strategic alignment, portfolio visibility, and value creation.",
    "or4": "Active in various sectors, we offer tailored solutions around three pillars:",
    "or5": "🔹 Consulting – PMO, maturity assessment, operational models, and change management through transformation projects",
    "or6": "🔹 Training – in project management (PMP®, PgMP®), PMO excellence, agility, soft skills, leadership",
    "or7": "🔹 Executive & team coaching – to enhance individual, collective, and managerial performance",
    "or8": "MEMBER OF THE",
    "or9": "JUDGING COMMITTEE",
    "par1": "Our Partners",
    "par2": "Strategic Partners",
    "par3": "The Project Management Institute (PMI) is the world's leading professional association for a growing global community of millions of project management professionals and change-makers worldwide.",
    "par4": "As the world's leading authority on project management, PMI empowers individuals to turn ideas into reality. Through its global advocacy, networks, collaborations, research, and educational offerings, PMI equips organizations and individuals at every stage of their careers to work smarter and achieve success in an ever-changing world. Building on a prestigious legacy dating back to 1969, PMI is a nonprofit organization present in nearly every country in the world. It works to advance careers, enhance organizational success, and provide change-makers with new skills and ways of working to maximize their impact. PMI’s offerings include globally recognized standards, certifications, online courses, tools, digital publications, thought leadership, and communities.",
    "par5": "Partners",
    "co1": "Get in Touch with Us",
    "co2": "Contact Us",
    "co3": "I accept the privacy policy",
    "co4": "Send",
    "pass1": "Join Us",
    "pass2": "The event that propels Project Management Offices (PMOs) toward operational and strategic excellence. Skills, influence, and performance dedicated to transformation.",
    "pass3": "Discover our Passes, designed to offer you an unparalleled experience.",
    "pass4": "Access exclusive zones, enjoy privileges, and experience events like never before.",
    "pass5": "Get Your Pass",
    "mo1": "Global PMO Leader and Agile Transformation Expert | Top 8 PMO Influencers (PMO Global Awards 2021) | Over 25 years of experience in strategic project management across 8+ countries | Certified PMP, PgMP, PMI-ACP | Speaker and Mentor.",
    "mo2": "Mohamed Khalifa is a globally recognized expert in project management, implementation of project offices, and digital transformation, with over 25 years of experience in IT, banking, oil and gas, telecommunications, and government sectors. As a PMO consultant, he specializes in strategic planning, Agile transformation, and PMO optimization.",
    "mo3": "Mohamed Khalifa has successfully managed projects in the United States, the United Kingdom, the Middle East, and beyond. He is a sought-after speaker, having presented at over 300 events, including PMI Global Congresses. He holds more than 20 certifications, including PMP, PgMP, and PMI-ACP, and was named one of the Top 8 PMO Influencers in the world by the PMO Global Awards (2021).",
    "kh1": "CEO of Bahri Group",
    "kh2": "Since 1993 with EPPM, Mr. BAHRI has acquired extensive experience as a multidisciplinary Project Director in the fields of environment, oil and gas, energy, cement plants, and the chemical industry. Mr. BAHRI notably led the project management, engineering, and construction of an offshore platform and a 6” – 36 km onshore and offshore pipeline connecting Kherkenah to Sfax in Tunisia on behalf of TBS (TPS). He has also directed and participated as a project manager or electromechanical expert in numerous projects in the environmental field with ONAS, including the construction of 13 wastewater treatment plants and over 100 pumping stations, with SONEDE for booster stations, and with CRDA for the development of 3 irrigated areas.",
    "kh3": "He has also served as a Project Director in various sectors. PMP Trainer, Built Environment Project Communication Pro, Authorized Training Partner Instructor PMP, PMI-CP®, PMI-SCP®, Prosci® Certified Change Practitioner.",
    "kh4": "Country",
    "im1": "President of PMITC",
    "im2": "Telecommunications engineer and holder of a Master’s degree. With over 17 years of experience, she has worked in mobile network installations at Tunisie Telecom, conducted research on networks at INRS-EMT for Bell Canada, and held various leadership positions in project management, including senior roles within multinational IT and telecommunications companies.",
    "im3": "She has extensive experience managing large-scale cross-functional projects in Africa, Europe, Latin America, and Asia. Currently, Imen is the Director of ICF Management Services, providing global consulting and training services for IT/Telecom projects. A certified PMP® professional since 2011, she has been an active volunteer at PMITC since 2016, elected VP of Communication and Marketing in 2020, and President since May 2023.",

  "yos1": "Organizer",
  "faq1": "Finalize Your Registration",
  "faq2": "Personal Information",
  "faq3": "Full Name",
  "faq4": "Email Address ",
  "faq5": "Organization/Company/University",
  "faq6": "Country",
  "faq7": "Select a Country",
  "faq8": "Your Passes",
  "faq9": "EVENT PASS",
  "faq10": "INDIVIDUAL PASS",
  "faq11": "TEAM PASS",
  "faq12": "STUDENT PASS",
  "faq13": "TRAINING PASS",
  "chinkwa":"DUO PASS",
  "faq14": "TRAINING PASS",
  "faq15": "EVENT PASS + 1 TRAINING SESSION",
  "faq16": "EVENT PASS + 2 TRAININGS SESSIONS",
  "faq17": "EVENT PASS + 3 TRAININGS SESSIONS",
  "faq18": "A Value That Transforms",
  "faq19": "Total Order",
  "faq20": "Promo Code",
  "faq21": "Phone Number",
  "indF1": "Day",
  "indF2": "Hour",
  "indF3": "Minute",
  "indF4": "Second",
  "e48YYY":"♦Navigating Digital and Cultural Transitions",
  "e49YYY":"♦Leadership distribué et Intelligence émotionnelle à l'ère de l'IA",
  "e50YYY":"♦Sponsorship and stakeholders: transforming decision-makers’ involvement into a true catalyst for performance.",



        "e51YYYY":"♦The Future of PMOs: Key Global and Regional Trends",
        "e52YYYY":"♦What if Darwin Was Right? Adapt or Disappear?",
        "e53YYYY":"♦Key Points Summary",
        "e38YY":"♦AI at the Core of PMO Operations ",
        "e39YY":"♦From Big Data to Smart Decisions Detecting ",
        "e40YY":"♦cyber risks in project portfolios",
        'faqU17':'EVENT PASS + 4 TRAININGS SESSIONS',
        'up1':'I have a promo code',
        'up2':"Verify",
        "up3":"Back to the site",
        "up5":"Registration with payment",
        "up6":"Registration without payment",
        "up10":"Registration Confirmation",
        "up11":"Your event registration has been successfully recorded !",
        "up12":"We will contact you shortly by phone to confirm your participation !",
        "up10B":"Client Information",
        "up13":"Name",
        "up14":"Email",
        "up15":"Phone",
        "up16":"Promo code",
        "up17":"Pass choice",
        "up18":"No pass selected",
        "up19":"Reference",
        "up20":"Back to Home",
        "up21":"print",
        "lup1": "Choose the payment method",
        "lup2": "Please choose your payment method:",
        "lup3": "Credit card",
        "lup4": "Bank transfer",
        "vipU1": "Order Confirmation",
  "vipU2": "Please make your transfer according to the instructions below",
  "vipU3": "Client Information",
  "vipU4": "Full Name",
  "vipU5": "Email",
  "vipU6": "Phone",
  "vipU6b": "Promo Code",
  "vipU7": "Selected Passes",
  "vipU8": "No pass selected.",
  "vipU9": "Total Amount to Pay",
  "vipU10": "Bank Details From Tunisia",
  "vipU11": "Bank",
  "vipU12": "(STB) - Société Tunisienne de Banque",
  "vipU13": "Name: Empowerment Paths",
  "vipU14": "Account Number",
  "vipU15": "Transfer Reference",
  "vipU16": "Important:",
  "vipU17": "Please include the exact reference above to facilitate the processing of your payment.",
  "vipU18": "Bank Details From Abroad",
  "vipU19": "Bank",
  "vipU20": "Attijari Bank",
  "vipU21": "Name: Empowerment Paths",
  "vipU22": "Account Number",
  "vipU23": "Transfer Reference",
  "vipU24": "Important:",
  "vipU25": "Please include the exact reference above to facilitate the processing of your payment.",
  "vipU26": "Back to homepage",
  "vipU27": "Print this page",
  "imiU1": "PMO Expert & Influencer and Author",
 "imiU2": "Heba AlShehhi is a PMO influencer, public speaker, TED Talk speaker, and the 2023 World PMO Leader of the Year. She leads the PMO of a government entity in Dubai and volunteers for PMI as the Head of PMOGA MENA Hub.",
 "imiU3": "With nearly twenty years of experience in government leadership, Heba has led her teams to multiple global awards. She is the author of 'Elements of Leadership', a nature-inspired leadership guide that redefines trust, empathy, and purpose in modern organizations. Her work bridges strategy with soul and performance with people.",
 "imiU4": "Country",
 "imiU5": "Tunis, Tunisia",
 'emiU1': 'expert in transformation, author, and speaker',
   'emiU2': 'is a transformation expert with over 15 years of experience advising boards and executives, managing multidisciplinary teams, and leading transformational projects.',
   'emiU3': 'She holds several pioneering distinctions: the first Bahraini woman certified as PMI-PfMP, the first Bahraini SIP-certified, and the first graduate in ESG (CGI).\n\nA multiple award winner, she was named #1 Female Leader in Project Management (GPMF 2024), received the AACE Exceptional Woman in Project Controls Award, the PowerList Middle East Award, and a bronze medal from Women Changing the World. She is also an author and speaker.',
   'smiU1': 'Professor of Cognitive Psychology and Strategic Advisor',
    'smiU2': 'A professor of cognitive psychology and strategic advisor, he has over 27 years of experience at the intersection of research, innovation, and organizational transformation. Founder of iLab@NAUSS, he designs intelligent tools and systems (risk behavior detection, resilience tracking, emotional recognition) to enhance project and team performance.',
    'smiU3': 'Advisor to UNODC, IOM, and UNOCT, he leads projects focused on youth resilience, radicalization prevention, and technological innovation (biometrics, leadership, emotional intelligence). A recipient of multiple awards (Academic Excellence 2025, E-learning 2024), he is recognized for his systemic vision, collaborative leadership, and ability to turn complexity into practical solutions for PMOs.',
    "NZim1": "Director of PMO and Transformation - Zitouna Bank - Panel Moderator",
    "NZim2": "Nazir brings over 20 years of experience in the financial and technology sectors. He began his career at 'Banque du Sud' (now 'Attijari Bank'), where he specialized in financial services and software engineering. Throughout his career, he has developed strong expertise in leading transformation programs, supporting operational excellence, structuring PMOs, and driving change management initiatives.",
    "NZim3": "Currently serving as Director of PMO and Transformation at Zitouna Bank, Nazir has been instrumental in enhancing the maturity of the PMO and aligning it with the bank’s overall growth, digital evolution, and agile transformation roadmap. His strengths include establishing PMOs, deploying project management methodologies, leading strategic transformation initiatives, and implementing enterprise-level tools. He is also recognized for his effective cross-functional collaboration and facilitation of planning processes. Prior to Zitouna Bank, he worked as a Senior Project Manager at Wevioo, successfully managing complex IT projects with multidisciplinary teams. Nazir is also an active contributor to the community, having served as VP of Finance for the PMI Tunisia Chapter from 2019 to 2023, after joining in 2018.",
  "hr11": "CEO Excellia Leadership – ICF Coach – Interim Manager",
  "hr12": "A visionary leader and a prominent figure in management in Tunisia, Henda Essafi Rekik has over 30 years of experience leading international industrial organizations (COFAT, Marquardt, Henkel, Faurecia, Amphenol, Valeo…). Winner of the Tunisia Woman Manager Award 2018 (1st Edition), she excels in leading strategic transformations, crisis management, and interim leadership.",
  "hr13": "An ICF-certified coach and Prosci® change management practitioner, she supports companies and leaders through organizational and cultural transitions by fostering leadership, agility, and innovation.",
  'par3F':'Diamond Partner',
  'par4F':'Média Partner',
  'Koundi1':'technology advisory and management expert ',
  'Koundi2':'Karim Koundi is a technology advisory and management expert with over 25 years of international ICT experience. Formerly Group CIO at Tunisie Telecom and a senior leader at Accenture France,',
  'Koundi3':'he joined Deloitte in 2013, where he led Advisory Services for Central Africa before becoming Country Managing Partner of Deloitte Tunisia in 2022 and serving on the Deloitte Francophone Africa executive board. He has advised governments and businesses across Africa on strategy and digital transformation.',
  'koundiP':'Country Managing Partner Tunisia & TMT Industry Leader Afrique Francophone',
  "OP1":"our pass",
  'Mouna1P': 'An engaged entrepreneur and a recognized figure in the Tunisian ecosystem, Mouna Chaieb currently chairs the Digital Economy Commission of the International Chamber of Commerce (ICC Tunisia), after having served as the national president of the Center of Young Business Leaders (CJD Tunisia). She also leads an independent consulting firm dedicated to the strategic and human transformation of ecosystems.',

'Mouna2P': 'She promotes a humanistic vision of innovation, which she sees as a lever for economic sovereignty and social cohesion. An expert on systemic and ethical issues related to artificial intelligence, she works to build bridges between emerging technologies, economic responsibility, and collective consciousness.',
'Mouna0P':'CEO | Facilitator in Corporate Governance | Social Innovation',
"ay1": "Director - ESG & Sustainability Platform at PwC France & Maghreb",
"ay2": "Director within the ESG platform at PwC France & Maghreb, Aimen Ktari leads strategic assignments in sustainability and ESG transformation.",
"ay3": "He plays an active role in CSR initiatives and in supporting companies' transition towards a sustainable economy",
"aicha1": "CSR Expert & Sustainable Development Project Manager",
"aicha2": "Aïcha TAMBOURA-DIAWARA, CSR Expert & Sustainable Development Project Manager. She holds a PhD in Information and Communication Sciences with over 22 years of experience. Aïcha TAMBOURA-DIAWARA is a recognized expert in Corporate Social Responsibility (CSR) and in managing development projects with high social impact. She specializes in integrating gender and equity into public policies, environmental sustainability, and participatory governance. She has led multisectoral projects(health, education, mining, agriculture) in more than 20 countries across Africa, Europe, and North America.",
"aicha3": "Her PMO expertise includes coordinating multicultural teams, fundraising, monitoring and evaluation, and training in inclusive leadership. With significant field experience, she has integrated CSR principles into all aspects of the project cycle to maximize social and environmental impact.",
"imenM1": "CEO & Co-founder at Horama Strategic Advisory | Expert in Digital Transformation & Strategy",
   "imenM2": "With over 20 years of experience in the financial sector and consulting, Imen Messadi supports institutions in their strategic, marketing, and digital transformation. She is currently the CEO of Horama Strategic Advisory, where she leads high-impact projects for financial institutions and SMEs. She has held senior executive positions in the banking sector, where she managed transformation, restructuring, marketing, strategic development, and digitalization projects.",
   "imenM3": "She operates between institutions and innovative ecosystems, turning expressed needs into concrete solutions through collaboration with startups and fintechs. Imen combines top-level strategic expertise with strong execution skills in complex and evolving environments.",
   "afef1": "Senior Executive in Telecom Industry",
"afef2": "Senior Executive In Telecom Industry'' Afef is a senior executive in the telecom industry with a strong technical and managerial background. She is a graduate the Tunis telecommunications engineering school (Sup'Com), and Warwick Business School (MBA). Afef started her career with Tunisian private mobile operators, contributing to the launch of Ooredoo (formerly Tunisiana) in 2002 and Orange Tunisia in 2010. She led product and service engineering departments, driving innovative service launches.",

"afef3": "She led product and service engineering departments, driving innovative service launches.From 2015 to 2021, Afef directed the Orange Group lab at Sofrecom Tunisia, promoting innovative mobile services across subsidiaries in the Middle East, Africa, and France. Currently, she leads the ITN & Data AI Jobline strategy for Orange Group, focusing on future skillsets in innovation, including devops, network softwarization, and generative AI. Afef’s role emphasizes expert community-building and preparing the skills evolution for major technological transformations.",
   "Naouel1": "Project Management Institute, Regional Mentor MENA",
   "Naouel2": "Naouel Ben Zina is a senior program manager with more than 20 years of experience in the Information Technology field. Naouel has taken different positions including Project Management roles such as Project, Program, Portfolio Manager, Head of PMO & Quality System, and Head of Operations. She has extensive experience in managing large and complex programs, leading cross-functional teams based in the EMEA region.",
   "Naouel3": "She holds an engineering degree diploma from the 'Ecole Polytechnique de Tunisie'. She has been PMP® certified since 2011. Naouel has been involved with PMI Tunisia Chapter since its launch in 2017 as VP of Communications, President, and Past President. She was appointed as Regional Mentor for the MENA Region in June 2022.",
   "omrane1": "Telecom engineer, holder of an E-MBA and a Master’s degree in Business Law",
"omrane2": "With more than 40 years of experience in ICT, he has held leadership positions at the Ministry of ICT, at Tunisie Telecom and its subsidiaries, before joining PwC Tunisia in 2016 as Senior Advisor.",
"omrane3": "He has led numerous projects in North Africa and Sub-Saharan Africa in the fields of strategy, transformation, operational efficiency, and program management, working with operators, regulators, governments, and international institutions."





















        }
    };
    langOptions.forEach(option => {
     option.addEventListener('click', function (e) {
         e.preventDefault();
         const selectedLang = this.dataset.lang;
         const langDict = translations[selectedLang];

         // Translate all elements with IDs
         translatableElements.forEach(el => {
             const key = el.id;
             if (langDict[key]) {
                 el.textContent = langDict[key];
             }
         });

         // Swap images
         imagesToSwap.forEach((img) => {
       const srcParts = img.src.split('/');
       const filename = srcParts[srcParts.length - 1]; // like "d5.jpg"
       const langFolder = (selectedLang === 'English') ? 'duoEN' : 'duoFR';
       img.src = `assets/img/${langFolder}/${filename}`;
   });

         // Optionally store selected language in localStorage
         localStorage.setItem('lang', selectedLang);
     });
 });

 // Auto-load previously selected language
 const savedLang = localStorage.getItem('lang');
 if (savedLang && translations[savedLang]) {
     document.querySelector(`.lang-option[data-lang="${savedLang}"]`)?.click();
 }


    // Function to apply the selected language
    function applyLanguage(lang) {
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }

    // Load the language from localStorage or default to English
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'English';
    applyLanguage(savedLanguage);

    // Event listener for language change
    langOptions.forEach(option => {
        option.addEventListener('click', function (event) {
            event.preventDefault();

            const selectedLang = option.getAttribute('data-lang');
            const languageToApply = selectedLang === 'Français' ? 'Français' : 'English';

            // Save the selected language to localStorage
            localStorage.setItem('selectedLanguage', languageToApply);

            // Apply the selected language
            applyLanguage(languageToApply);
        });
    });
});







    document.addEventListener('scroll', function () {
        const languageToggle = document.getElementById('languageToggle');
        if (window.scrollY > 50) { // Adjust 50 to the scroll threshold you prefer
            languageToggle.classList.add('scrolled');
        } else {
            languageToggle.classList.remove('scrolled');
        }
    });





        document.addEventListener("DOMContentLoaded", () => {
            const languageToggle = document.getElementById("languageToggle");
            const mobileMenu = document.querySelector(".tdmobile__menu-box");

            const updateLanguageTogglePosition = () => {
                const isMobile = window.matchMedia("(max-width: 992px)").matches;

                if (isMobile) {
                    if (!mobileMenu.contains(languageToggle)) {
                        mobileMenu.appendChild(languageToggle);
                    }
                } else {
                    const desktopWrapper = document.querySelector(".tdmenu__wrap");
                    if (desktopWrapper && !desktopWrapper.contains(languageToggle)) {
                        desktopWrapper.appendChild(languageToggle);
                    }
                }
            };

            // Initial check
            updateLanguageTogglePosition();

            // Listen for window resize
            window.addEventListener("resize", updateLanguageTogglePosition);
        });
