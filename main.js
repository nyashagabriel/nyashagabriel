"use strict";

/* ================================================================== *
 *  STATE + DOM ELEMENT REFERENCES
 * ================================================================== */

const state = {
  assets: null,
  activeSection: "hero",
};

const elements = {
  loader: document.getElementById("site-loader"),
  loaderText: document.getElementById("loader-text"),
  navBrand: document.getElementById("nav-brand"),
  desktopNavLinks: document.getElementById("desktop-nav-links"),
  menuToggle: document.getElementById("menu-toggle"),
  menuClose: document.getElementById("menu-close"),
  navigationPanel: document.getElementById("navigation-panel"),
  navigationBackdrop: document.getElementById("navigation-backdrop"),
  detailedNavigation: document.getElementById("detailed-navigation"),
  navEyebrow: document.getElementById("nav-eyebrow"),
  navTitle: document.getElementById("nav-title"),
  navStatusLabel: document.getElementById("nav-status-label"),
  navStatusValue: document.getElementById("nav-status-value"),

  heroFirstName: document.getElementById("hero-first-name"),
  heroLastName: document.getElementById("hero-last-name"),
  heroRoles: document.getElementById("hero-roles"),
  heroSocials: document.getElementById("hero-socials"),
  heroQuote: document.getElementById("hero-quote"),
  heroScroll: document.getElementById("hero-scroll"),
  scrollLabel: document.getElementById("scroll-label"),

  profileImage: document.getElementById("profile-image"),
  aboutIndex: document.getElementById("about-index"),
  aboutHeading: document.getElementById("about-heading"),
  aboutBio: document.getElementById("about-bio"),
  skillList: document.getElementById("skill-list"),

  originIndex: document.getElementById("origin-index"),
  originHeading: document.getElementById("origin-heading"),
  originStory: document.getElementById("origin-story"),
  traitBadge: document.getElementById("trait-badge"),
  familyQuoteBox: document.getElementById("family-quote-box"),

  timelineIndex: document.getElementById("timeline-index"),
  timelineHeading: document.getElementById("timeline-heading"),
  timelineList: document.getElementById("timeline-list"),

  creativeIndex: document.getElementById("creative-index"),
  creativeHeading: document.getElementById("creative-heading"),
  creativeProjects: document.getElementById("creative-projects"),

  printIndex: document.getElementById("print-index"),
  printHeading: document.getElementById("print-heading"),
  experienceList: document.getElementById("experience-list"),

  devIndex: document.getElementById("dev-index"),
  devHeading: document.getElementById("dev-heading"),
  devProjects: document.getElementById("development-projects"),

  buildingIndex: document.getElementById("building-index"),
  buildingHeading: document.getElementById("building-heading"),
  terminalTitle: document.getElementById("terminal-title"),
  terminalBody: document.getElementById("terminal-body"),

  contactIndex: document.getElementById("contact-index"),
  contactHeading: document.getElementById("contact-heading"),
  contactIntro: document.getElementById("contact-intro"),
  contactStatusLabel: document.getElementById("contact-status-label"),
  contactStatusValue: document.getElementById("contact-status-value"),
  contactSocials: document.getElementById("contact-socials"),

  footerBgImg: document.getElementById("footer-bg-img"),
  footerColumns: document.getElementById("footer-columns"),
  footerCopyright: document.getElementById("footer-copyright"),
  footerLinks: document.getElementById("footer-links"),
};

/* ================================================================== *
 *  DATA LOADING
 *  Everything on the page is driven by assets.json — edit that file
 *  to change content; you should rarely need to touch this script.
 * ================================================================== */

async function loadPortfolioAssets() {
  try {
    const response = await fetch("assets.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load assets.json. Status: ${response.status}`);
    const data = await response.json();
    validatePortfolioData(data);
    state.assets = data;
    return data;
  } catch (error) {
    console.error("Portfolio initialization failed:", error);
    showInitializationError(error);
    return null;
  }
}

function validatePortfolioData(data) {
  if (!data || typeof data !== "object") throw new Error("assets.json does not contain a valid object.");
  if (!data.site || typeof data.site !== "object") throw new Error("Missing site configuration.");
  if (!data.navigation || !Array.isArray(data.navigation.items)) throw new Error("Missing navigation items.");
  if (!data.assets || typeof data.assets !== "object") throw new Error("Missing asset configuration.");
  if (!data.hero || typeof data.hero !== "object") throw new Error("Missing hero configuration.");
}

/* ================================================================== *
 *  MASTER RENDER — one function per section, called in page order
 * ================================================================== */

function renderPortfolio(data) {
  renderDocumentData(data);
  renderNavigation(data);
  renderDetailedNavigation(data);
  renderHero(data);
  renderAbout(data.about);
  renderOrigin(data.origin);
  renderTimeline(data.timeline);
  renderProjectGrid(data.creative_work, elements.creativeProjects, elements.creativeIndex, elements.creativeHeading);
  renderExperience(data.print_design);
  renderProjectGrid(data.dev_projects, elements.devProjects, elements.devIndex, elements.devHeading);
  renderTerminal(data.currently_building);
  renderContact(data.contact);
  renderSocials(elements.contactSocials, data.assets.socials);
  renderFooter(data.footer, data.site);
}

/* ---------------------------------------------------------------- *
 *  Document-level (title, meta description, nav brand)
 * ---------------------------------------------------------------- */

function renderDocumentData(data) {
  if (data.site.name) document.title = data.site.name;
  const description = document.querySelector('meta[name="description"]');
  if (description && data.site.description) description.setAttribute("content", data.site.description);
  const brand = data.navigation.brand;
  if (elements.navBrand && brand && brand.label) elements.navBrand.textContent = brand.label;
  if (elements.navBrand && brand && brand.target) elements.navBrand.href = brand.target;
}

/* ---------------------------------------------------------------- *
 *  Navigation (top bar links + slide-out "explore" panel)
 * ---------------------------------------------------------------- */

function renderNavigation(data) {
  if (!elements.desktopNavLinks) return;
  elements.desktopNavLinks.innerHTML = "";
  data.navigation.items.forEach((item) => {
    if (!isValidNavigationItem(item)) return;
    const link = document.createElement("a");
    link.className = "desktop-nav-link";
    link.href = item.target;
    link.dataset.section = item.id;
    link.textContent = item.label;
    elements.desktopNavLinks.appendChild(link);
  });
}

function renderDetailedNavigation(data) {
  if (elements.navEyebrow) elements.navEyebrow.textContent = "PORTFOLIO.NAV";
  if (elements.navTitle) elements.navTitle.textContent = "EXPLORE";
  if (elements.navStatusLabel) elements.navStatusLabel.textContent = "SYSTEM STATUS";
  if (elements.navStatusValue) elements.navStatusValue.textContent = "ONLINE";

  if (!elements.detailedNavigation) return;
  elements.detailedNavigation.innerHTML = "";

  data.navigation.items.forEach((item, index) => {
    if (!isValidNavigationItem(item)) return;
    const link = document.createElement("a");
    link.className = "detailed-nav-item";
    link.href = item.target;
    link.dataset.section = item.id;

    const icon = document.createElement("div");
    icon.className = "detailed-nav-icon";
    const iconElement = document.createElement("span");
    iconElement.className = "material-symbols-outlined";
    iconElement.textContent = item.icon || "arrow_forward";
    icon.appendChild(iconElement);

    const content = document.createElement("div");
    content.className = "detailed-nav-content";
    const number = document.createElement("span");
    number.className = "detailed-nav-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("span");
    label.className = "detailed-nav-label";
    label.textContent = item.label;
    const description = document.createElement("span");
    description.className = "detailed-nav-description";
    description.textContent = item.description || "";

    content.append(number, label, description);
    link.append(icon, content);
    elements.detailedNavigation.appendChild(link);
  });
}

function isValidNavigationItem(item) {
  return Boolean(item && typeof item.id === "string" && typeof item.label === "string" && typeof item.target === "string");
}

/* ---------------------------------------------------------------- *
 *  00 · Hero
 * ---------------------------------------------------------------- */

function renderHero(data) {
  const hero = data.hero || {};
  if (hero.name && elements.heroFirstName) elements.heroFirstName.textContent = hero.name.first || "GABRIEL";
  if (hero.name && elements.heroLastName) elements.heroLastName.textContent = hero.name.last || "KUUDZADOMBO";
  renderHeroRoles(hero.roles);
  if (elements.heroQuote) elements.heroQuote.textContent = hero.quote || "";
  if (elements.scrollLabel && hero.scroll) elements.scrollLabel.textContent = hero.scroll.label || "SCROLL";
  if (elements.heroScroll && hero.scroll && hero.scroll.target) elements.heroScroll.href = hero.scroll.target;

  renderSocials(elements.heroSocials, data.assets.socials);

  if (elements.profileImage && data.assets.profile) {
    const profile = data.assets.profile;
    if (profile.src) elements.profileImage.src = profile.src;
    if (profile.alt) elements.profileImage.alt = profile.alt;
    elements.profileImage.addEventListener("error", handleImageError, { once: true });
  }
}

function renderHeroRoles(roles) {
  if (!elements.heroRoles) return;
  elements.heroRoles.innerHTML = "";
  if (!Array.isArray(roles)) return;
  roles.forEach((role) => {
    if (typeof role !== "string" || role.trim().length === 0) return;
    const roleElement = document.createElement("span");
    roleElement.className = "hero-role";
    roleElement.textContent = role;
    elements.heroRoles.appendChild(roleElement);
  });
}

/* ---------------------------------------------------------------- *
 *  01 · About (bio + skills)
 * ---------------------------------------------------------------- */

function renderAbout(data) {
  if (!data) return;
  if (elements.aboutIndex) elements.aboutIndex.textContent = data.index;
  if (elements.aboutHeading) elements.aboutHeading.textContent = data.heading;
  if (elements.aboutBio) {
    elements.aboutBio.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = data.bio;
    elements.aboutBio.appendChild(p);
  }
  if (elements.skillList && Array.isArray(data.skills)) {
    elements.skillList.innerHTML = "";
    data.skills.forEach((skill) => {
      const li = document.createElement("li");
      const iconSpan = document.createElement("span");
      iconSpan.className = "material-symbols-outlined skill-icon";
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.textContent = skill.icon;
      li.appendChild(iconSpan);
      li.appendChild(document.createTextNode(" " + skill.label));
      elements.skillList.appendChild(li);
    });
  }
}

/* ---------------------------------------------------------------- *
 *  01 · Roots / Origin (story + family influences)
 *
 *  Each family silhouette is clickable/focusable. Clicking (or
 *  tabbing to + pressing Enter/Space on) a figure reveals that
 *  person's "quote" (their influence) in #family-quote-box.
 * ---------------------------------------------------------------- */

function renderOrigin(data) {
  if (!data) return;
  if (elements.originIndex) elements.originIndex.textContent = data.index;
  if (elements.originHeading) elements.originHeading.textContent = data.heading;
  if (elements.traitBadge) elements.traitBadge.textContent = data.trait;

  if (elements.originStory) {
    elements.originStory.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = data.story;
    elements.originStory.appendChild(p);
  }

  if (!Array.isArray(data.family)) return;

  data.family.forEach((member) => {
    const figure = document.querySelector(`.silhouette-figure[data-role="${member.role}"]`);
    if (!figure) return;

    const img = figure.querySelector(".silhouette-icon");
    const label = figure.querySelector(".silhouette-label");
    if (img && member.src) img.src = member.src;
    if (label && member.label) label.textContent = member.label;

    // Store the quote on the element itself so the click handler can read it.
    if (member.quote) figure.dataset.quote = member.quote;

    // Make each figure keyboard-accessible.
    figure.setAttribute("tabindex", "0");
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `${member.label || "Family member"} — show influence`);
  });

  setupFamilyQuoteInteractions();
}

function setupFamilyQuoteInteractions() {
  const figures = document.querySelectorAll(".silhouette-figure[data-quote]");
  if (!elements.familyQuoteBox || figures.length === 0) return;

  figures.forEach((figure) => {
    figure.addEventListener("click", () => showFamilyQuote(figure));
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showFamilyQuote(figure);
      }
    });
  });
}

function showFamilyQuote(figure) {
  if (!elements.familyQuoteBox) return;
  const quote = figure.dataset.quote || "";
  elements.familyQuoteBox.textContent = quote;
  elements.familyQuoteBox.classList.toggle("active", quote.length > 0);

  document.querySelectorAll(".silhouette-figure").forEach((el) => el.classList.remove("silhouette-figure--active"));
  figure.classList.add("silhouette-figure--active");
}

/* ---------------------------------------------------------------- *
 *  02 · Timeline
 * ---------------------------------------------------------------- */

function renderTimeline(data) {
  if (!data || !elements.timelineList) return;
  if (elements.timelineIndex) elements.timelineIndex.textContent = data.index;
  if (elements.timelineHeading) elements.timelineHeading.textContent = data.heading;

  elements.timelineList.innerHTML = "";
  if (!Array.isArray(data.milestones) || data.milestones.length === 0) {
    elements.timelineList.appendChild(buildEmptyStateCard("Timeline coming soon."));
    return;
  }

  data.milestones.forEach((milestone, index) => {
    const item = document.createElement("li");
    item.className = "timeline-item";

    const marker = document.createElement("span");
    marker.className = "timeline-marker";
    const step = document.createElement("span");
    step.className = "timeline-step";
    step.textContent = String(index + 1).padStart(2, "0");
    marker.appendChild(step);
    if (typeof milestone.date === "string" && milestone.date.trim()) {
      const date = document.createElement("span");
      date.className = "timeline-date";
      date.textContent = milestone.date.trim();
      marker.appendChild(date);
    }

    const content = document.createElement("div");
    content.className = "timeline-content";
    const label = document.createElement("h3");
    label.textContent = milestone.label;
    const desc = document.createElement("p");
    desc.textContent = milestone.description;
    content.append(label, desc);

    item.append(marker, content);
    elements.timelineList.appendChild(item);
  });
}

/* ---------------------------------------------------------------- *
 *  Reusable: project grid (used by Creative Work + Systems/Dev)
 *  Shows an empty-state card + optional placeholder message when
 *  a section has no projects yet (e.g. work-in-progress sections).
 * ---------------------------------------------------------------- */

function renderProjectGrid(data, container, indexEl, headingEl) {
  if (!data || !container) return;
  if (indexEl) indexEl.textContent = data.index;
  if (headingEl) headingEl.textContent = data.heading;
  container.innerHTML = "";

  const projects = Array.isArray(data.projects) ? data.projects : [];
  if (projects.length === 0) {
    container.appendChild(buildEmptyStateCard(data.placeholder || "Nothing here yet."));
    return;
  }

  projects.forEach((proj) => {
    const article = document.createElement("article");
    article.className = "project-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "project-card-image";
    const images = Array.isArray(proj.images) ? proj.images.filter(Boolean) : [];
    if (images.length > 0) {
      const mainImg = document.createElement("img");
      mainImg.src = images[0];
      mainImg.alt = proj.title || "";
      mainImg.loading = "lazy";
      mainImg.addEventListener("error", handleImageError, { once: true });
      imgWrap.appendChild(mainImg);
    } else {
      imgWrap.classList.add("placeholder-image");
    }

    const contentDiv = document.createElement("div");
    contentDiv.className = "project-card-content";
    const title = document.createElement("h3");
    title.textContent = proj.title;
    const desc = document.createElement("p");
    desc.textContent = proj.description;
    contentDiv.append(title, desc);

    article.append(imgWrap, contentDiv);

    // Extra images become clickable thumbnails that swap the main image.
    if (images.length > 1) {
      const gallery = document.createElement("div");
      gallery.className = "project-card-gallery";
      images.forEach((src, index) => {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "project-card-thumb";
        if (index === 0) thumb.classList.add("active");
        const thumbImg = document.createElement("img");
        thumbImg.src = src;
        thumbImg.alt = "";
        thumbImg.loading = "lazy";
        thumb.appendChild(thumbImg);
        thumb.addEventListener("click", () => {
          const mainImg = imgWrap.querySelector("img");
          if (mainImg) mainImg.src = src;
          gallery.querySelectorAll(".project-card-thumb").forEach((t) => t.classList.remove("active"));
          thumb.classList.add("active");
        });
        gallery.appendChild(thumb);
      });
      contentDiv.appendChild(gallery);
    }

    container.appendChild(article);
  });
}

function buildEmptyStateCard(message) {
  const card = document.createElement("div");
  card.className = "empty-data-card";
  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined";
  icon.textContent = "hourglass_empty";
  const text = document.createElement("p");
  text.textContent = message;
  card.append(icon, text);
  return card;
}

/* ---------------------------------------------------------------- *
 *  Print & Design (experience/timeline-style list)
 * ---------------------------------------------------------------- */

function renderExperience(data) {
  if (!data || !elements.experienceList || !Array.isArray(data.experience)) return;
  if (elements.printIndex) elements.printIndex.textContent = data.index;
  if (elements.printHeading) elements.printHeading.textContent = data.heading;
  elements.experienceList.innerHTML = "";

  data.experience.forEach((exp) => {
    const article = document.createElement("article");
    article.className = "experience-item";
    const marker = document.createElement("span");
    marker.className = "experience-marker";
    const contentDiv = document.createElement("div");
    const company = document.createElement("h3");
    company.textContent = exp.company;
    const role = document.createElement("p");
    role.className = "experience-role";
    role.textContent = exp.role;
    const desc = document.createElement("p");
    desc.textContent = exp.description;

    contentDiv.append(company, role, desc);

    const images = Array.isArray(exp.images) ? exp.images.filter(Boolean) : [];
    if (images.length > 0) {
      const imageRow = document.createElement("div");
      imageRow.className = "experience-image-row";
      images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${exp.company || ""} work sample`;
        img.loading = "lazy";
        img.addEventListener("error", handleImageError, { once: true });
        imageRow.appendChild(img);
      });
      contentDiv.appendChild(imageRow);
    }

    article.append(marker, contentDiv);
    elements.experienceList.appendChild(article);
  });
}

/* ---------------------------------------------------------------- *
 *  Currently Building (terminal widget)
 * ---------------------------------------------------------------- */

function renderTerminal(data) {
  if (!data) return;
  if (elements.buildingIndex) elements.buildingIndex.textContent = data.index;
  if (elements.buildingHeading) elements.buildingHeading.textContent = data.heading;
  if (data.terminal && elements.terminalTitle) elements.terminalTitle.textContent = data.terminal.title;

  if (data.terminal && Array.isArray(data.terminal.lines) && elements.terminalBody) {
    elements.terminalBody.innerHTML = "";
    data.terminal.lines.forEach((line) => {
      const p = document.createElement("p");
      const prompt = document.createElement("span");
      prompt.className = "terminal-prompt";
      prompt.textContent = "> ";
      p.appendChild(prompt);
      p.appendChild(document.createTextNode(line));
      elements.terminalBody.appendChild(p);
    });
    const cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    cursor.textContent = "_";
    elements.terminalBody.appendChild(cursor);
  }
}

/* ---------------------------------------------------------------- *
 *  Contact
 * ---------------------------------------------------------------- */

function renderContact(data) {
  if (!data) return;
  if (elements.contactIndex) elements.contactIndex.textContent = data.index;
  if (elements.contactHeading) elements.contactHeading.textContent = data.heading;
  if (elements.contactIntro) {
    elements.contactIntro.innerHTML = "";
    const p = document.createElement("p");
    p.className = "contact-intro";
    p.textContent = data.intro;
    elements.contactIntro.appendChild(p);
  }
  if (data.status) {
    if (elements.contactStatusLabel) elements.contactStatusLabel.textContent = data.status.label;
    if (elements.contactStatusValue) elements.contactStatusValue.textContent = data.status.value;
  }
}

/* ---------------------------------------------------------------- *
 *  Footer
 * ---------------------------------------------------------------- */

function renderFooter(footerData, siteData) {
  if (!footerData) return;

  if (elements.footerBgImg && footerData.background) {
    elements.footerBgImg.src = footerData.background;
    elements.footerBgImg.addEventListener("error", handleImageError, { once: true });
  }

  if (elements.footerColumns && Array.isArray(footerData.columns)) {
    elements.footerColumns.innerHTML = "";
    footerData.columns.forEach((col) => {
      const colDiv = document.createElement("div");
      colDiv.className = "footer-column";

      const title = document.createElement("h4");
      title.className = "footer-column-title";
      title.textContent = col.title;
      colDiv.appendChild(title);

      if (Array.isArray(col.links)) {
        const linksDiv = document.createElement("div");
        linksDiv.className = "footer-column-links";
        col.links.forEach((link) => {
          const a = document.createElement("a");
          a.className = "footer-link";
          a.href = link.url;
          a.textContent = link.label;
          linksDiv.appendChild(a);
        });
        colDiv.appendChild(linksDiv);
      }
      elements.footerColumns.appendChild(colDiv);
    });
  }

  if (elements.footerCopyright) {
    elements.footerCopyright.textContent = footerData.text || `© ${new Date().getFullYear()} ${siteData?.owner || "Nyasha Gabriel"}`;
  }

  if (elements.footerLinks && Array.isArray(footerData.links)) {
    elements.footerLinks.innerHTML = "";
    footerData.links.forEach((link) => {
      const a = document.createElement("a");
      a.className = "footer-link";
      a.href = link.url;
      a.textContent = link.label;
      elements.footerLinks.appendChild(a);
    });
  }
}

/* ---------------------------------------------------------------- *
 *  Shared: socials + image error fallback
 * ---------------------------------------------------------------- */

function renderSocials(container, socials) {
  if (!container || !Array.isArray(socials)) return;
  container.innerHTML = "";
  socials.forEach((social) => {
    if (!social || typeof social !== "object" || !social.icon) return;
    const hasValidUrl = social.enabled === true && typeof social.url === "string" && social.url.trim().length > 0 && social.url !== "#";
    const element = hasValidUrl ? document.createElement("a") : document.createElement("button");
    element.className = "social-link";

    if (hasValidUrl) {
      element.href = social.url;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    } else {
      element.type = "button";
      element.classList.add("disabled");
      element.disabled = true;
    }

    element.setAttribute("aria-label", social.label || social.name || "Social media link");
    const image = document.createElement("img");
    image.src = social.icon;
    image.alt = social.name || "";
    image.loading = "lazy";
    image.addEventListener("error", handleImageError, { once: true });

    element.appendChild(image);
    container.appendChild(element);
  });
}

function handleImageError(event) {
  const image = event.currentTarget;
  image.style.display = "none";
  const parent = image.parentElement;
  if (!parent) return;
  parent.classList.add("image-error");
  const fallback = document.createElement("span");
  fallback.className = "material-symbols-outlined";
  fallback.textContent = "image_not_supported";
  parent.appendChild(fallback);
}

/* ================================================================== *
 *  NAVIGATION INTERACTIONS (menu open/close, active-link tracking)
 * ================================================================== */

function openNavigation() {
  if (!elements.navigationPanel || !elements.navigationBackdrop) return;
  elements.navigationPanel.classList.add("open");
  elements.navigationPanel.setAttribute("aria-hidden", "false");
  elements.navigationBackdrop.classList.add("visible");
  document.body.style.overflow = "hidden";
  if (elements.menuToggle) elements.menuToggle.setAttribute("aria-expanded", "true");
}

function closeNavigation() {
  if (!elements.navigationPanel || !elements.navigationBackdrop) return;
  elements.navigationPanel.classList.remove("open");
  elements.navigationPanel.setAttribute("aria-hidden", "true");
  elements.navigationBackdrop.classList.remove("visible");
  document.body.style.overflow = "";
  if (elements.menuToggle) elements.menuToggle.setAttribute("aria-expanded", "false");
}

function setupNavigationEvents() {
  elements.menuToggle?.addEventListener("click", openNavigation);
  elements.menuClose?.addEventListener("click", closeNavigation);
  elements.navigationBackdrop?.addEventListener("click", closeNavigation);
  elements.detailedNavigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
}

function setupSectionObserver() {
  const sections = document.querySelectorAll("main section[id]");
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        state.activeSection = entry.target.id;
        updateActiveNavigation();
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((section) => observer.observe(section));
}

function updateActiveNavigation() {
  document.querySelectorAll(".desktop-nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.section === state.activeSection);
  });
}

/* ================================================================== *
 *  INITIALIZATION
 * ================================================================== */

function showInitializationError(error) {
  console.error(error);
  if (elements.loaderText) elements.loaderText.textContent = "INITIALIZATION_FAILED";
  document.body.classList.add("portfolio-error");
}

function hideLoader() {
  window.setTimeout(() => {
    elements.loader?.classList.add("hidden");
  }, 250);
}

async function initializePortfolio() {
  try {
    const data = await loadPortfolioAssets();
    if (data) renderPortfolio(data);
    setupNavigationEvents();
    setupSectionObserver();
  } catch (error) {
    console.error("Unexpected initialization error:", error);
  } finally {
    hideLoader();
  }
}

document.addEventListener("DOMContentLoaded", initializePortfolio);