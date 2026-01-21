async function loadSharedPartials() {
  const headerHost = document.querySelector('[data-shared-header]');
  const footerHost = document.querySelector('[data-shared-footer]');

  const tasks = [];

  if (headerHost) {
    tasks.push(
      fetch('header.html?v=2')
        .then((res) => (res.ok ? res.text() : ''))
        .then((html) => {
          if (html) {
            headerHost.innerHTML = html;
          }
        })
        .catch(() => {})
    );
  }

  if (footerHost) {
    tasks.push(
      fetch('footer.html?v=2')
        .then((res) => (res.ok ? res.text() : ''))
        .then((html) => {
          if (html) {
            footerHost.innerHTML = html;
          }
        })
        .catch(() => {})
    );
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }
}

function initSite() {
  // Smooth scroll for internal links
  const mainNav = document.querySelector('.main-nav');
  const navToggle = document.querySelector('.nav-toggle');

  // If we are on the main one-page site, rewrite index.html#section
  // links to #section so they behave as in-page anchors.
  const path = window.location.pathname || '';
  const isHomePage = /index\.html$/i.test(path) || path === '/' || path === '';

  if (isHomePage && mainNav) {
    mainNav.querySelectorAll('a[href^="index.html#"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      link.setAttribute('href', href.replace(/^index\.html/i, ''));
    });
  }

  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      // Rely on CSS scroll-margin-top for consistent positioning
      if (typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({ top: rect.top + scrollTop, behavior: 'smooth' });
      }

      // If mobile menu is open, close it after choosing a link
      if (mainNav && navToggle && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active link highlighting on scroll (only meaningful on index page with sections)
  const sections = document.querySelectorAll('main section[id]');

  function updateActiveNav() {
    if (!sections.length) return;

    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight : 0;
    const fromTop = window.scrollY + headerOffset + 40;

    let currentId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (sectionTop <= fromTop) {
        currentId = section.id;
      }
    });

    document
      .querySelectorAll('.main-nav .nav-link')
      .forEach((link) => link.classList.remove('active'));

    if (currentId) {
      const active = document.querySelector(`.main-nav .nav-link[href="#${currentId}"]`);
      if (active) active.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Hamburger navigation for small screens
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Simple front-end validation for contact form (only exists on main page)
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = /** @type {HTMLInputElement | null} */ (document.getElementById('name'));
      const email = /** @type {HTMLInputElement | null} */ (document.getElementById('email'));
      const message = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('message'));

      if (!name || !email || !message) return;

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        feedback.textContent = getText('form.errorRequired');
        feedback.classList.remove('success');
        feedback.classList.add('error');
        return;
      }

      const emailPattern = /.+@.+\..+/;
      if (!emailPattern.test(email.value)) {
        feedback.textContent = getText('form.errorEmail');
        feedback.classList.remove('success');
        feedback.classList.add('error');
        return;
      }

      feedback.textContent = getText('form.success');
      feedback.classList.remove('error');
      feedback.classList.add('success');
      form.reset();
    });
  }

  // Apply language and wire language buttons (now present in injected header)
  applyLanguage(currentLang);

  document.querySelectorAll('.lang-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;
      applyLanguage(lang);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSharedPartials().then(() => {
    initSite();
  });
});

// --- Simple i18n system ---
// When you add new text in HTML, give it a data-i18n key like data-i18n="section.key"
// and then add translations for that key under en, fr and zh in this object.

/** @type {"en" | "fr" | "zh"} */
let currentLang = (localStorage.getItem('cdc_lang') || 'en');

const translations = {
  en: {
    'meta.title': 'Coeur Du Ciel (CDC) - Marketing Agency',
    'brand.name': 'Coeur Du Ciel (CDC)',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.download': 'Download',
    'nav.login': 'Login',
    'hero.eyebrow': 'Marketing Services Agency',
    'hero.title': 'Empowering Brands Through Creative Marketing',
    'hero.subtitle': 'Digital marketing and branding solutions that drive growth, engagement, and visibility.',
    'hero.ctaPrimary': 'Get Started',
    'hero.ctaSecondary': 'Contact Us',
    'hero.servicesTitle': 'What We Do',
    'hero.pillDigital': 'Digital Marketing',
    'hero.pillBranding': 'Branding & Design',
    'hero.pillStrategy': 'Strategy & Consulting',
    'hero.imageLabel': 'Featured Campaign',
    'hero.statCampaignsNumber': '+120',
    'hero.statCampaignsLabel': 'Campaigns Launched',
    'hero.statBrandsNumber': '+40',
    'hero.statBrandsLabel': 'Brands Supported',
    'hero.statRoiNumber': '+200%',
    'hero.statRoiLabel': 'Average ROI',
    'about.title': 'Who We Are',
    'about.body': 'A team of marketing professionals dedicated to helping businesses grow through innovative strategies and creative design. With expertise in digital marketing and branding, we deliver measurable results and lasting brand impact.',
    'about.highlightsTitle': 'Why Clients Choose CDC',
    'about.highlight1': 'Experienced marketing strategists and designers',
    'about.highlight2': 'Data-driven approach focused on measurable outcomes',
    'about.highlight3': 'Proven success across a wide range of industries',
    'services.eyebrow': 'Services',
    'services.title': 'What We Offer',
    'services.digitalTitle': 'Digital Marketing',
    'services.digital1': 'Social Media Management',
    'services.digital2': 'SEO Optimization',
    'services.digital3': 'PPC Campaigns',
    'services.digital4': 'Email Marketing',
    'services.digital5': 'Content Creation',
    'services.brandTitle': 'Branding & Design',
    'services.brand1': 'Logo Design',
    'services.brand2': 'Brand Strategy',
    'services.brand3': 'Visual Identity',
    'services.brand4': 'Marketing Collateral',
    'services.brand5': 'Rebranding',
    'services.cta': 'Explore Our Services',
    'services.appsCta': 'View Apps & Tools',
    'portfolio.eyebrow': 'Digital Products',
    'portfolio.title': 'Our Apps & Experiences',
    'portfolio.body': "CDC's own digital tools that simplify communication, branding and project follow-up for small businesses and independent professionals.",
    'portfolio.card1Title': 'NameCard – Digital Business Card',
    'portfolio.card1Body': 'A digital business card behind a QR code or short link. Centralise your contact details and key links in one place and update them without reprinting cards.',
    'portfolio.card1Tag': 'Client Experience',
    'portfolio.card2Title': 'Befitting – Smart Fitting Experience',
    'portfolio.card2Body': 'A smart fitting assistant that uses QR codes on garments and customer body profiles to suggest the most suitable size, reducing returns and speeding up purchase decisions.',
    'portfolio.card2Tag': 'Size Recommendation',
    'portfolio.card3Title': 'TaskTicket – Light Project Tracker',
    'portfolio.card3Body': 'A light ticket view for marketing and design requests that organises tasks by status and keeps briefs and comments attached to each item.',
    'portfolio.card3Tag': 'Workflow',
    'portfolio.card4Title': 'Web Creator – Newsletter & Page Builder',
    'portfolio.card4Body': 'A visual editor for newsletters and simple pages with a fixed header and footer. Assemble branded blocks and export clean HTML or PDF ready to send.',
    'portfolio.card4Tag': 'Content Tool',

    // Contact section
    'contact.eyebrow': 'Contact',
    'contact.title': "Let's Work Together",
    'contact.body': 'Ready to launch your next campaign or reimagine your brand? Share a few details about your project and our team will get back to you with tailored recommendations.',
    'contact.emailLabel': 'Email',
    'contact.phoneLabel': 'Phone',
    'contact.addressLabel': 'Address',
    'contact.addressValue': '2 Rue des Anglais, Massy 91300',
    'contact.socialLabel': 'Follow CDC',

    // Contact form
    'form.nameLabel': 'Name',
    'form.emailLabel': 'Email',
    'form.companyLabel': 'Company',
    'form.messageLabel': 'Message',
    'form.submit': 'Send Message',
    'form.errorRequired': 'Please fill in all required fields.',
    'form.errorEmail': 'Please enter a valid email address.',
    'form.success': 'Thank you! Your message has been stored locally.',

    // Footer
    'footer.home': 'Home',
    'footer.about': 'About',
    'footer.services': 'Services',
    'footer.portfolio': 'Portfolio',
    'footer.contact': 'Contact',
    'footer.download': 'Download',
    'footer.login': 'Login',
    'footer.copy': 'Copyright © 2025 Coeur Du Ciel',

    // Apps page
    'apps.metaTitle': 'Apps & Tools - Coeur Du Ciel (CDC)',
    'apps.eyebrow': 'Applications',
    'apps.title': 'CDC Digital Tools and Experiences',
    'apps.intro': 'Discover the applications and digital products developed by Coeur Du Ciel (CDC) to support your marketing, sales and client experience. Use this page as your launchpad to explore each tool in more detail.',
    'apps.imageLabel': 'Overview of CDC digital tools',

    'apps.namecardTitle': 'Digital Business Card (NameCard)',
    'apps.namecardBody': 'A fully digital business card that lives behind a QR code or short link. Centralise your contact details, social profiles and key links in one place, then update everything without reprinting any physical cards.',
    'apps.namecardBenefit1': 'Share one QR code or link instead of stacks of paper cards.',
    'apps.namecardBenefit2': 'Update your profile once and keep all recipients up to date.',
    'apps.namecardBenefit3': 'Add photo, role, contact channels and key URLs on a single page.',
    'apps.namecardCta': 'Open NameCard',

    'apps.befittingTitle': 'Befitting – Smart Fitting Experience',
    'apps.befittingBody': 'Give your customers a virtual fitting room in their pocket. By scanning the QR code on each garment, Befitting compares the item with their saved body profile and instantly suggests the most suitable size.',
    'apps.befittingBenefit1': 'Link each garment to a QR code for instant size advice.',
    'apps.befittingBenefit2': 'Use body profiles and measurements instead of guesswork.',
    'apps.befittingBenefit3': 'Reduce fitting time and returns for in-store or online shopping.',
    'apps.befittingStatus': 'Concept app in development – demo available on request.',

    'apps.taskticketTitle': 'TaskTicket – Light Project Tracker',
    'apps.taskticketBody': 'A simple ticket view for following marketing and design requests. Group tasks by status, keep briefs and comments attached to each item, and maintain a clear overview of what is in progress or completed.',
    'apps.taskticketBenefit1': 'Capture marketing and design tasks as clear, trackable tickets.',
    'apps.taskticketBenefit2': 'Organise work by status so priorities are visible at a glance.',
    'apps.taskticketBenefit3': 'Keep briefs, notes and decisions attached to each ticket.',
    'apps.taskticketStatus': 'Internal tool used at CDC – client-ready version planned.',

    'apps.webcreatorTitle': 'Web Creator – Newsletter & Page Builder',
    'apps.webcreatorBody': 'A visual editor for building newsletters and simple presentation pages with a fixed header and footer. Use branded content blocks to assemble layouts without writing code.',
    'apps.webcreatorBenefit1': 'Compose newsletters and pages from reusable content sections.',
    'apps.webcreatorBenefit2': 'Keep a consistent header, footer and brand style across all layouts.',
    'apps.webcreatorBenefit3': 'Export clean HTML or PDF that is ready to send or print.',
    'apps.webcreatorStatus': 'Currently used in CDC projects – can be adapted to your brand needs.',
  },
  fr: {
    'meta.title': 'Coeur Du Ciel (CDC) - Agence de marketing',
    'brand.name': 'Coeur Du Ciel (CDC)',

    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.portfolio': 'Réalisations',
    'nav.testimonials': 'Témoignages',
    'nav.contact': 'Contact',
    'nav.download': 'Téléchargements',
    'nav.login': 'Connexion',

    // Hero section
    'hero.eyebrow': 'Agence de services marketing',
    'hero.title': 'Donner plus de force à votre marque',
    'hero.subtitle': 'Stratégies digitales et branding créatif pour développer la notoriété, l’engagement et la performance.',
    'hero.ctaPrimary': 'Commencer un projet',
    'hero.ctaSecondary': 'Nous contacter',
    'hero.servicesTitle': 'Ce que nous faisons',
    'hero.pillDigital': 'Marketing digital',
    'hero.pillBranding': 'Branding & design',
    'hero.pillStrategy': 'Stratégie & conseil',
    'hero.imageLabel': 'Campagne mise en avant',
    'hero.statCampaignsNumber': '+120',
    'hero.statCampaignsLabel': 'Campagnes lancées',
    'hero.statBrandsNumber': '+40',
    'hero.statBrandsLabel': 'Marques accompagnées',
    'hero.statRoiNumber': '+200%',
    'hero.statRoiLabel': 'ROI moyen',

    // About section
    'about.title': 'Qui sommes-nous ?',
    'about.body': "Une équipe de professionnels du marketing dédiée à la croissance des entreprises grâce à des stratégies innovantes et un design créatif. Nous combinons expertise digitale et branding pour obtenir des résultats mesurables et durables.",
    'about.highlightsTitle': 'Pourquoi choisir CDC ?',
    'about.highlight1': 'Stratèges marketing et designers expérimentés',
    'about.highlight2': 'Approche pilotée par les données et les résultats',
    'about.highlight3': 'Références dans de nombreux secteurs d’activité',

    // Services section
    'services.eyebrow': 'Services',
    'services.title': 'Nos expertises',
    'services.digitalTitle': 'Marketing digital',
    'services.digital1': 'Gestion des réseaux sociaux',
    'services.digital2': 'Référencement naturel (SEO)',
    'services.digital3': 'Campagnes publicitaires payantes (PPC)',
    'services.digital4': 'Emailing & automatisation',
    'services.digital5': 'Création de contenus',
    'services.brandTitle': 'Branding & design',
    'services.brand1': 'Création de logo',
    'services.brand2': 'Plateforme et stratégie de marque',
    'services.brand3': 'Identité visuelle complète',
    'services.brand4': 'Supports de communication',
    'services.brand5': 'Repositionnement et rebranding',
    'services.cta': 'Découvrir nos services',
    'services.appsCta': 'Voir les applications & outils',

    // Testimonials section
    'testimonials.eyebrow': 'Témoignages',
    'testimonials.title': 'Ce que disent nos clients',
    'testimonials.quote1': '"CDC nous a accompagnés sur le lancement de Befitting avec une stratégie claire et des créations percutantes. Les résultats du premier mois ont dépassé nos objectifs."',
    'testimonials.author1': '— Sophie L., Directrice marketing, Befitting',

    // Portfolio section
    'portfolio.eyebrow': 'Produits digitaux',
    'portfolio.title': 'Nos applications & expériences',
    'portfolio.body': "Des outils digitaux CDC pour simplifier la communication, le branding et le suivi de projet des petites entreprises et indépendants.",
    'portfolio.card1Title': 'NameCard – Carte de visite digitale',
    'portfolio.card1Body': 'Carte de visite 100 % digitale reliée à un QR code ou à un lien court. Centralisez vos coordonnées et liens clés au même endroit, sans réimpression papier.',
    'portfolio.card1Tag': 'Expérience client',
    'portfolio.card2Title': 'Befitting – Expérience d’essayage intelligente',
    'portfolio.card2Body': 'Assistant d’essayage intelligent qui utilise des QR codes et des profils morphologiques pour recommander la taille la plus adaptée et limiter les retours.',
    'portfolio.card2Tag': 'Recommandation de taille',
    'portfolio.card3Title': 'TaskTicket – Suivi léger de projets',
    'portfolio.card3Body': 'Vue en tickets légère pour suivre les demandes marketing et design, avec tâches classées par statut et briefs/commentaires attachés à chaque item.',
    'portfolio.card3Tag': 'Workflow',
    'portfolio.card4Title': 'Web Creator – Créateur de newsletters & pages',
    'portfolio.card4Body': 'Éditeur visuel de newsletters et pages avec en-tête et pied de page fixes. Assemblez des blocs de contenu de marque et exportez un HTML ou PDF propre.',
    'portfolio.card4Tag': 'Outil de contenu',
    // ... (rest of the code remains the same)
    'testimonials.quote2': '"Le nouveau système de marque Cœur Du Ciel est élégant et simple à appliquer pour toutes nos équipes."',
    'testimonials.author2': '— Marc D., Brand manager, Cœur Du Ciel',
    'testimonials.quote3': '"De la stratégie à l’exécution, CDC fonctionne comme une extension de notre équipe marketing."',
    'testimonials.author3': '— Angela W., CEO, entreprise de services',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Travaillons ensemble',
    'contact.body': 'Prêt à lancer votre prochaine campagne ou à repenser votre marque ? Partagez quelques informations et nous reviendrons vers vous avec des recommandations sur mesure.',
    'contact.emailLabel': 'Email',
    'contact.phoneLabel': 'Téléphone',
    'contact.addressLabel': 'Adresse',
    'contact.addressValue': '2 Rue des Anglais, Massy 91300',
    'contact.socialLabel': 'Suivre CDC',
    'form.nameLabel': 'Nom',
    'form.emailLabel': 'Email',
    'form.companyLabel': 'Entreprise',
    'form.messageLabel': 'Message',
    'form.submit': 'Envoyer',
    'form.errorRequired': 'Merci de remplir tous les champs obligatoires.',
    'form.errorEmail': 'Merci de saisir une adresse email valide.',
    'form.success': 'Merci ! Votre message a été enregistré localement.',
    'footer.home': 'Accueil',
    'footer.about': 'À propos',
    'footer.services': 'Services',
    'footer.portfolio': 'Réalisations',
    'footer.contact': 'Contact',
    'apps.metaTitle': 'Applications & Outils - Coeur Du Ciel (CDC)',
    'apps.eyebrow': 'Applications',
    'apps.title': 'Outils et expériences numériques CDC',
    'apps.intro': 'Découvrez les applications et produits digitaux développés par Cœur Du Ciel (CDC) pour renforcer votre marketing, vos ventes et vos parcours clients. Cette page est votre point de départ pour explorer chaque outil plus en détail.',
    'apps.imageLabel': 'Vue d’ensemble des outils digitaux CDC',

    'apps.namecardTitle': 'Carte de visite numérique (NameCard)',
    'apps.namecardBody': "Carte de visite 100 % digitale reliée à un QR code ou à un lien court. Centralisez coordonnées, réseaux sociaux et liens clés au même endroit, puis mettez tout à jour sans réimprimer de supports.",
    'apps.namecardBenefit1': 'Partagez un seul QR code ou lien plutôt que des piles de cartes papier.',
    'apps.namecardBenefit2': 'Mettez à jour votre profil une fois et tenez tous vos contacts informés.',
    'apps.namecardBenefit3': 'Ajoutez photo, rôle, canaux de contact et liens clés sur une page unique.',
    'apps.namecardCta': 'Ouvrir NameCard',

    'apps.befittingTitle': 'Befitting – Expérience d’essayage intelligente',
    'apps.befittingBody': 'Offrez à vos clients une cabine d’essayage virtuelle sur leur smartphone. En scannant le QR code d’un vêtement, Befitting compare la pièce à leur profil morphologique enregistré et suggère instantanément la taille la plus adaptée.',
    'apps.befittingBenefit1': 'Reliez chaque vêtement à un QR code pour un conseil de taille immédiat.',
    'apps.befittingBenefit2': 'Utilisez profils et mensurations plutôt que des estimations approximatives.',
    'apps.befittingBenefit3': 'Réduisez le temps passé en cabine et le volume de retours.',
    'apps.befittingStatus': 'Application conceptuelle en développement – démo disponible sur demande.',

    'apps.taskticketTitle': 'TaskTicket – Suivi léger de projets',
    'apps.taskticketBody': 'Une vue en tickets pour suivre les demandes de marketing et de design. Regroupez les tâches par statut, conservez briefs et commentaires au même endroit et gardez une vision claire de ce qui est en cours ou clôturé.',
    'apps.taskticketBenefit1': 'Enregistrez les demandes en tickets clairs et faciles à suivre.',
    'apps.taskticketBenefit2': 'Ordonnez le travail par statut pour visualiser les priorités en un coup d’œil.',
    'apps.taskticketBenefit3': 'Gardez briefs, notes et décisions attachés à chaque ticket.',
    'apps.taskticketStatus': 'Outil interne utilisé chez CDC – version client en préparation.',

    'apps.webcreatorTitle': 'Web Creator – Créateur de newsletters & pages',
    'apps.webcreatorBody': 'Un éditeur visuel pour concevoir des newsletters et pages de présentation avec en-tête et pied de page fixes. Utilisez des blocs de contenu aux couleurs de votre marque, sans écrire de code.',
    'apps.webcreatorBenefit1': 'Composez newsletters et pages à partir de sections réutilisables.',
    'apps.webcreatorBenefit2': 'Conservez un en-tête, un pied de page et un style de marque cohérents.',
    'apps.webcreatorBenefit3': 'Exportez un HTML ou un PDF propre, prêt à être envoyé ou imprimé.',
    'apps.webcreatorStatus': 'Actuellement utilisé dans les projets CDC – adaptable à votre marque.',
  },
  zh: {
    'meta.title': 'Coeur Du Ciel (CDC) - 品牌营销机构',
    'brand.name': 'Coeur Du Ciel (CDC)',
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.services': '服务',
    'nav.portfolio': '作品案例',
    'nav.testimonials': '客户评价',
    'nav.contact': '联系',
    'nav.download': '下载',
    'nav.login': '登录',
    'hero.eyebrow': '品牌与数字营销机构',
    'hero.title': '以创意营销赋能您的品牌',
    'hero.subtitle': '通过数字营销与品牌策略，帮助企业提升增长、参与度与曝光度。',
    'hero.ctaPrimary': '开始合作',
    'hero.ctaSecondary': '联系我们',
    'hero.servicesTitle': '我们的专长',
    'hero.pillDigital': '数字营销',
    'hero.pillBranding': '品牌与设计',
    'hero.pillStrategy': '战略咨询',
    'hero.imageLabel': '精选案例',
    'hero.statCampaignsNumber': '+120',
    'hero.statCampaignsLabel': '已执行活动',
    'hero.statBrandsNumber': '+40',
    'hero.statBrandsLabel': '合作品牌',
    'hero.statRoiNumber': '+200%',
    'hero.statRoiLabel': '平均投资回报',
    'about.title': '我们是谁',
    'about.body': '我们是一支专注于企业增长的营销团队，通过创新策略和创意设计，为客户打造可衡量的数字营销成果与长期的品牌影响力。',
    'about.highlightsTitle': '选择 CDC 的理由',
    'about.highlight1': '经验丰富的营销策划与设计团队',
    'about.highlight2': '以数据为驱动，关注实际结果',
    'about.highlight3': '跨行业的成功项目经验',
    'services.eyebrow': '服务',
    'services.title': '我们的服务',
    'services.digitalTitle': '数字营销',
    'services.digital1': '社交媒体运营',
    'services.digital2': 'SEO 搜索优化',
    'services.digital3': 'PPC 付费广告投放',
    'services.digital4': '电子邮件营销',
    'services.digital5': '内容创作',
    'services.brandTitle': '品牌与设计',
    'services.brand1': '标志设计',
    'services.brand2': '品牌策略',
    'services.brand3': '视觉识别系统',
    'services.brand4': '营销物料设计',
    'services.brand5': '品牌重塑',
    'services.cta': '查看全部服务',
    'services.appsCta': '查看应用与工具',
    'portfolio.eyebrow': '数字产品',
    'portfolio.title': '自研应用与体验',
    'portfolio.body': '展示 CDC 自主开发的数字工具，帮助小型企业和自由职业者更轻松地沟通、展示品牌并跟进项目。',
    'portfolio.card1Title': 'NameCard 数字名片',
    'portfolio.card1Body': '完全数字化的名片，通过二维码或短链接访问，将联系方式和重要链接集中在同一页面，随时在线更新，无需重新印刷。',
    'portfolio.card1Tag': '客户体验',
    'portfolio.card2Title': 'Befitting 智能试衣体验',
    'portfolio.card2Body': '智能试衣助手，通过扫描服装二维码并匹配顾客身形档案，快速推荐更合适的尺码，降低退换货率并加快决策。',
    'portfolio.card2Tag': '尺码推荐',
    'portfolio.card3Title': 'TaskTicket 轻量项目看板',
    'portfolio.card3Body': '用于跟进市场与设计需求的轻量工单视图，按状态整理任务，并在单个工单中集中保存简报与评论。',
    'portfolio.card3Tag': '工作流',
    'portfolio.card4Title': 'Web Creator 新闻简报与页面编辑器',
    'portfolio.card4Body': '用于搭建新闻简报和介绍页面的可视化编辑器，内置固定页眉与页脚模块，一键导出干净的 HTML 或 PDF，方便发送或打印。',
    'portfolio.card4Tag': '内容工具',
    'testimonials.eyebrow': '客户评价',
    'testimonials.title': '客户怎么说',
    'testimonials.quote1': '"CDC 为 Befitting 规划并执行上市活动，策略清晰、创意到位，首月数据就超出预期。"',
    'testimonials.author1': '— Sophie L.，Befitting 市场总监',
    'testimonials.quote2': '"全新的 Cœur Du Ciel 品牌系统既优雅又易于落地，我们的团队在各个渠道都能保持统一形象。"',
    'testimonials.author2': '— Marc D.，Cœur Du Ciel 品牌经理',
    'testimonials.quote3': '"从创意构想到日常执行，CDC 更像是与我们并肩作战的内部营销团队。"',
    'testimonials.author3': '— Angela W.，服务型企业 CEO',
    'contact.eyebrow': '联系',
    'contact.title': '一起合作',
    'contact.body': '如果您准备开启新活动或升级品牌形象，欢迎留下项目信息，我们将提供专属方案。',
    'contact.emailLabel': '邮箱',
    'contact.phoneLabel': '电话',
    'contact.addressLabel': '地址',
    'contact.addressValue': '2 Rue des Anglais, Massy 91300',
    'contact.socialLabel': '关注 CDC',
    'form.nameLabel': '姓名',
    'form.emailLabel': '邮箱',
    'form.companyLabel': '公司',
    'form.messageLabel': '留言',
    'form.submit': '发送信息',
    'form.errorRequired': '请填写所有必填字段。',
    'form.errorEmail': '请输入正确的邮箱地址。',
    'form.success': '谢谢！您的信息已在本地记录。',
    'footer.home': '首页',
    'footer.about': '关于',
    'footer.services': '服务',
    'footer.portfolio': '案例',
    'footer.contact': '联系',
    'footer.download': '下载',
    'footer.login': '登录',
    'footer.copy': 'Copyright © 2025 Coeur Du Ciel',

    // Apps page
    'apps.metaTitle': '应用与工具 - Coeur Du Ciel (CDC)',
    'apps.eyebrow': '应用',
    'apps.title': 'CDC 数字工具与体验',
    'apps.intro': '了解由 Coeur Du Ciel (CDC) 打造的数字应用和产品，帮助提升营销效果、销售转化和客户体验。本页面是进入各个工具的起点，方便您进一步了解和试用。',
    'apps.imageLabel': 'CDC 数字工具一览',

    'apps.namecardTitle': '数字名片（NameCard）',
    'apps.namecardBody': '一张完全数字化的名片，通过二维码或短链接访问。将联系方式、社交账号和重要链接集中在同一页面，随时在线更新，无需重新印刷纸质名片。',
    'apps.namecardBenefit1': '用一个二维码或链接替代一叠纸质名片。',
    'apps.namecardBenefit2': '资料只需更新一次，所有接收者都会看到最新信息。',
    'apps.namecardBenefit3': '在同一页面展示头像、职务、联系方式和关键链接。',
    'apps.namecardCta': '打开 NameCard',

    'apps.befittingTitle': 'Befitting 智能试衣体验',
    'apps.befittingBody': '为顾客提供随身携带的“虚拟试衣间”。只需扫描衣服上的二维码，Befitting 即可根据顾客已保存的身形档案匹配这件单品，并即时推荐更合适的尺码。',
    'apps.befittingBenefit1': '为每件衣服配置二维码，实现即时尺码建议。',
    'apps.befittingBenefit2': '基于身材档案与测量数据，而非主观猜测。',
    'apps.befittingBenefit3': '缩短试衣时间，减少线上线下的退换货。',
    'apps.befittingStatus': '概念应用开发中——如需演示，请联系我们。',

    'apps.taskticketTitle': 'TaskTicket 轻量项目跟进',
    'apps.taskticketBody': '用于跟进市场与设计需求的简洁工单视图。按状态分组任务，在每张工单中集中保存简报和评论，清晰掌握进行中与已完成的工作。',
    'apps.taskticketBenefit1': '将市场和设计需求记录为清晰、可追踪的工单。',
    'apps.taskticketBenefit2': '按状态管理任务，一眼看出当前优先级。',
    'apps.taskticketBenefit3': '在每张工单中集中保存简报、备注和决策记录。',
    'apps.taskticketStatus': '目前作为 CDC 内部工具使用，计划推出面向客户的版本。',

    'apps.webcreatorTitle': 'Web Creator 新闻简报与页面编辑器',
    'apps.webcreatorBody': '用于搭建新闻简报和介绍页面的可视化编辑器，内置固定页眉与页脚模块，通过拖拽组合品牌化内容模块，无需编写代码。',
    'apps.webcreatorBenefit1': '使用可复用内容模块快速搭建简报和页面。',
    'apps.webcreatorBenefit2': '在所有版式中保持统一的页眉、页脚和品牌风格。',
    'apps.webcreatorBenefit3': '一键导出干净的 HTML 或 PDF，便于发送或打印。',
    'apps.webcreatorStatus': '目前已在 CDC 项目中使用，可根据您的品牌需求进行定制。',
  },
};

function getText(key) {
  const langPack = translations[currentLang] || translations.en;
  return langPack[key] || translations.en[key] || '';
}

function applyLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('cdc_lang', lang);

  const nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (!key) return;
    const text = getText(key);
    if (!text) return;
    node.textContent = text;
  });

  // Ensure brand name is always updated explicitly
  const brand = document.querySelector('.brand-text');
  if (brand) {
    brand.textContent = getText('brand.name');
  }

  const html = document.documentElement;
  if (html) {
    html.lang = lang === 'zh' ? 'zh-Hans' : lang;
  }

  const titleNode = document.querySelector('title[data-i18n="meta.title"]');
  if (titleNode) {
    titleNode.textContent = getText('meta.title');
  }

  document.querySelectorAll('.lang-button').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });
}

// Language buttons are wired in initSite after header is available
