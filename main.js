"use strict";

const state = {
  assets: null,
  activeSection: "hero",
};

const elements = {
  loader: document.getElementById("site-loader"),

  navBrand: document.getElementById("nav-brand"),
  desktopNavLinks: document.getElementById(
    "desktop-nav-links",
  ),

  menuToggle: document.getElementById(
    "menu-toggle",
  ),

  menuClose: document.getElementById(
    "menu-close",
  ),

  navigationPanel: document.getElementById(
    "navigation-panel",
  ),

  navigationBackdrop: document.getElementById(
    "navigation-backdrop",
  ),

  detailedNavigation: document.getElementById(
    "detailed-navigation",
  ),

  heroFirstName: document.getElementById(
    "hero-first-name",
  ),

  heroLastName: document.getElementById(
    "hero-last-name",
  ),

  heroRoles: document.getElementById(
    "hero-roles",
  ),

  heroSocials: document.getElementById(
    "hero-socials",
  ),

  heroQuote: document.getElementById(
    "hero-quote",
  ),

  heroScroll: document.getElementById(
    "hero-scroll",
  ),

  profileImage: document.getElementById(
    "profile-image",
  ),

  contactSocials: document.getElementById(
    "contact-socials",
  ),
};

/* =========================================================
   DATA LOADING
   ========================================================= */

async function loadPortfolioAssets() {
  try {
    const response = await fetch(
      "assets.json",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Could not load assets.json. Status: ${response.status}`,
      );
    }

    const data = await response.json();

    validatePortfolioData(data);

    state.assets = data;

    return data;
  } catch (error) {
    console.error(
      "Portfolio initialization failed:",
      error,
    );

    showInitializationError(error);

    return null;
  }
}

function validatePortfolioData(data) {
  if (!data || typeof data !== "object") {
    throw new Error(
      "assets.json does not contain a valid object.",
    );
  }

  if (!data.site || typeof data.site !== "object") {
    throw new Error(
      "Missing site configuration.",
    );
  }

  if (
    !data.navigation ||
    !Array.isArray(data.navigation.items)
  ) {
    throw new Error(
      "Missing navigation items.",
    );
  }

  if (
    !data.assets ||
    typeof data.assets !== "object"
  ) {
    throw new Error(
      "Missing asset configuration.",
    );
  }

  if (!data.hero || typeof data.hero !== "object") {
    throw new Error(
      "Missing hero configuration.",
    );
  }
}

/* =========================================================
   PORTFOLIO RENDERING
   ========================================================= */

function renderPortfolio(data) {
  renderDocumentData(data);
  renderNavigation(data);
  renderDetailedNavigation(data);
  renderHero(data);
  renderProfile(data);
  renderContactSocials(data);
}

function renderDocumentData(data) {
  if (data.site.name) {
    document.title = data.site.name;
  }

  const description = document.querySelector(
    'meta[name="description"]',
  );

  if (
    description &&
    data.site.description
  ) {
    description.setAttribute(
      "content",
      data.site.description,
    );
  }

  const brand = data.navigation.brand;

  if (
    elements.navBrand &&
    brand &&
    brand.label
  ) {
    elements.navBrand.textContent =
      brand.label;
  }

  if (
    elements.navBrand &&
    brand &&
    brand.target
  ) {
    elements.navBrand.href =
      brand.target;
  }
}

/* =========================================================
   DESKTOP NAVIGATION
   ========================================================= */

function renderNavigation(data) {
  if (!elements.desktopNavLinks) {
    return;
  }

  elements.desktopNavLinks.innerHTML = "";

  const visibleItems =
    data.navigation.items.slice(0, 6);

  visibleItems.forEach((item) => {
    if (!isValidNavigationItem(item)) {
      return;
    }

    const link =
      document.createElement("a");

    link.className =
      "desktop-nav-link";

    link.href = item.target;
    link.dataset.section = item.id;
    link.textContent = item.label;

    elements.desktopNavLinks.appendChild(
      link,
    );
  });
}

/* =========================================================
   DETAILED NAVIGATION
   ========================================================= */

function renderDetailedNavigation(data) {
  if (!elements.detailedNavigation) {
    return;
  }

  elements.detailedNavigation.innerHTML = "";

  data.navigation.items.forEach(
    (item, index) => {
      if (!isValidNavigationItem(item)) {
        return;
      }

      const link =
        document.createElement("a");

      link.className =
        "detailed-nav-item";

      link.href = item.target;
      link.dataset.section = item.id;

      const icon =
        document.createElement("div");

      icon.className =
        "detailed-nav-icon";

      const iconElement =
        document.createElement("span");

      iconElement.className =
        "material-symbols-outlined";

      iconElement.textContent =
        item.icon || "arrow_forward";

      icon.appendChild(iconElement);

      const content =
        document.createElement("div");

      content.className =
        "detailed-nav-content";

      const number =
        document.createElement("span");

      number.className =
        "detailed-nav-number";

      number.textContent =
        String(index + 1).padStart(
          2,
          "0",
        );

      const label =
        document.createElement("span");

      label.className =
        "detailed-nav-label";

      label.textContent =
        item.label;

      const description =
        document.createElement("span");

      description.className =
        "detailed-nav-description";

      description.textContent =
        item.description || "";

      content.append(
        number,
        label,
        description,
      );

      link.append(
        icon,
        content,
      );

      elements.detailedNavigation.appendChild(
        link,
      );
    },
  );
}

/* =========================================================
   HERO
   ========================================================= */

function renderHero(data) {
  const hero = data.hero || {};

  if (
    hero.name &&
    elements.heroFirstName
  ) {
    elements.heroFirstName.textContent =
      hero.name.first || "NYASHA";
  }

  if (
    hero.name &&
    elements.heroLastName
  ) {
    elements.heroLastName.textContent =
      hero.name.last || "GABRIEL";
  }

  renderHeroRoles(hero.roles);

  if (elements.heroQuote) {
    elements.heroQuote.textContent =
      hero.quote || "";
  }

  if (
    elements.heroScroll &&
    hero.scroll &&
    hero.scroll.target
  ) {
    elements.heroScroll.href =
      hero.scroll.target;
  }

  renderSocials(
    elements.heroSocials,
    data.assets.socials,
  );
}

function renderHeroRoles(roles) {
  if (!elements.heroRoles) {
    return;
  }

  elements.heroRoles.innerHTML = "";

  if (!Array.isArray(roles)) {
    return;
  }

  roles.forEach((role) => {
    if (
      typeof role !== "string" ||
      role.trim().length === 0
    ) {
      return;
    }

    const roleElement =
      document.createElement("span");

    roleElement.className =
      "hero-role";

    roleElement.textContent =
      role;

    elements.heroRoles.appendChild(
      roleElement,
    );
  });
}

/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile(data) {
  if (
    !elements.profileImage ||
    !data.assets.profile
  ) {
    return;
  }

  const profile =
    data.assets.profile;

  if (profile.src) {
    elements.profileImage.src =
      profile.src;
  }

  if (profile.alt) {
    elements.profileImage.alt =
      profile.alt;
  }

  elements.profileImage.addEventListener(
    "error",
    handleImageError,
    {
      once: true,
    },
  );
}

/* =========================================================
   SOCIALS
   ========================================================= */

function renderContactSocials(data) {
  renderSocials(
    elements.contactSocials,
    data.assets.socials,
  );
}

function renderSocials(
  container,
  socials,
) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(socials)) {
    return;
  }

  socials.forEach((social) => {
    if (
      !social ||
      typeof social !== "object" ||
      !social.icon
    ) {
      return;
    }

    const hasValidUrl =
      social.enabled === true &&
      typeof social.url === "string" &&
      social.url.trim().length > 0;

    const element = hasValidUrl
      ? document.createElement("a")
      : document.createElement("button");

    element.className =
      "social-link";

    if (hasValidUrl) {
      element.href =
        social.url;

      element.target =
        "_blank";

      element.rel =
        "noopener noreferrer";
    } else {
      element.type =
        "button";

      element.classList.add(
        "disabled",
      );

      element.disabled = true;
    }

    element.setAttribute(
      "aria-label",
      social.label ||
        social.name ||
        "Social media link",
    );

    const image =
      document.createElement("img");

    image.src =
      social.icon;

    image.alt =
      social.name || "";

    image.loading =
      "lazy";

    image.addEventListener(
      "error",
      handleImageError,
      {
        once: true,
      },
    );

    element.appendChild(
      image,
    );

    container.appendChild(
      element,
    );
  });
}

function handleImageError(event) {
  const image =
    event.currentTarget;

  image.style.display =
    "none";

  const parent =
    image.parentElement;

  if (!parent) {
    return;
  }

  parent.classList.add(
    "image-error",
  );

  const fallback =
    document.createElement("span");

  fallback.className =
    "material-symbols-outlined";

  fallback.textContent =
    "image_not_supported";

  parent.appendChild(
    fallback,
  );
}

/* =========================================================
   VALIDATION
   ========================================================= */

function isValidNavigationItem(item) {
  return Boolean(
    item &&
      typeof item.id === "string" &&
      typeof item.label === "string" &&
      typeof item.target === "string",
  );
}

/* =========================================================
   NAVIGATION INTERACTION
   ========================================================= */

function openNavigation() {
  if (
    !elements.navigationPanel ||
    !elements.navigationBackdrop
  ) {
    return;
  }

  elements.navigationPanel.classList.add(
    "open",
  );

  elements.navigationPanel.setAttribute(
    "aria-hidden",
    "false",
  );

  elements.navigationBackdrop.classList.add(
    "visible",
  );

  document.body.style.overflow =
    "hidden";

  if (elements.menuToggle) {
    elements.menuToggle.setAttribute(
      "aria-expanded",
      "true",
    );
  }
}

function closeNavigation() {
  if (
    !elements.navigationPanel ||
    !elements.navigationBackdrop
  ) {
    return;
  }

  elements.navigationPanel.classList.remove(
    "open",
  );

  elements.navigationPanel.setAttribute(
    "aria-hidden",
    "true",
  );

  elements.navigationBackdrop.classList.remove(
    "visible",
  );

  document.body.style.overflow =
    "";

  if (elements.menuToggle) {
    elements.menuToggle.setAttribute(
      "aria-expanded",
      "false",
    );
  }
}

function setupNavigationEvents() {
  elements.menuToggle?.addEventListener(
    "click",
    openNavigation,
  );

  elements.menuClose?.addEventListener(
    "click",
    closeNavigation,
  );

  elements.navigationBackdrop?.addEventListener(
    "click",
    closeNavigation,
  );

  elements.detailedNavigation?.addEventListener(
    "click",
    (event) => {
      const link =
        event.target.closest("a");

      if (link) {
        closeNavigation();
      }
    },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeNavigation();
      }
    },
  );
}

/* =========================================================
   ACTIVE SECTION TRACKING
   ========================================================= */

function setupSectionObserver() {
  const sections =
    document.querySelectorAll(
      "main section[id]",
    );

  if (
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          state.activeSection =
            entry.target.id;

          updateActiveNavigation();
        });
      },
      {
        threshold: 0.35,
      },
    );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function updateActiveNavigation() {
  document
    .querySelectorAll(
      ".desktop-nav-link",
    )
    .forEach((link) => {
      link.classList.toggle(
        "active",
        link.dataset.section ===
          state.activeSection,
      );
    });
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function showInitializationError(error) {
  console.error(error);

  document.body.classList.add(
    "portfolio-error",
  );
}

function hideLoader() {
  window.setTimeout(() => {
    elements.loader?.classList.add(
      "hidden",
    );
  }, 250);
}

async function initializePortfolio() {
  try {
    const data =
      await loadPortfolioAssets();

    if (data) {
      renderPortfolio(data);
    }

    setupNavigationEvents();
    setupSectionObserver();
  } catch (error) {
    console.error(
      "Unexpected initialization error:",
      error,
    );
  } finally {
    hideLoader();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  initializePortfolio,
);