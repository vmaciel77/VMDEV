(() => {
  "use strict";

  // ================= TEMA CLARO / ESCURO =================

  const themeBtn = document.getElementById("theme-btn");
  const THEME_KEY = "theme";

  /** Aplica o tema informado ao documento. */
  const applyTheme = (dark) => {
    document.documentElement.classList.toggle("dark", dark);
  };

  // Tema salvo tem prioridade; senão, usa a preferência do sistema
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    });
  }

  // ================= MENU HAMBURGUER =================

  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  const ICON_BARS = "fa-bars";
  const ICON_CLOSE = "fa-xmark";

  /** Troca o ícone do botão conforme o menu está aberto ou fechado. */
  const setIcon = (open) => {
    const icon = menuBtn.querySelector("i");
    if (!icon) return;
    icon.classList.toggle(ICON_BARS, !open);
    icon.classList.toggle(ICON_CLOSE, open);
  };

  /** Fecha o menu e restaura o ícone. */
  const closeMenu = () => {
    menu.classList.remove("active");
    setIcon(false);
  };

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("active");
      setIcon(menu.classList.contains("active"));
    });

    // Fecha o menu ao clicar em um link
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // ================= ANO AUTOMÁTICO =================

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ================= HEADER COM SOMBRA AO ROLAR =================

  const header = document.querySelector(".header");

  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    toggleHeaderShadow();
    window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
  }

  // ================= TILT 3D (CARDS E FOTO) =================
  // Segue o cursor e escreve variáveis CSS (--tilt-x, --tilt-y,
  // --glow-x, --glow-y) que o style.css usa para rotacionar o
  // elemento e mover o brilho. Só roda em dispositivos com mouse.

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;

  if (!prefersReducedMotion && hasHover) {
    const tiltElements = document.querySelectorAll(
      ".about-card, .skill, .project, .service"
    );

    const MAX_TILT = 8; // graus

    tiltElements.forEach((el) => {
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width; // 0 a 1
        const relY = (event.clientY - rect.top) / rect.height; // 0 a 1

        const tiltX = (relX - 0.5) * MAX_TILT * 2;
        const tiltY = (relY - 0.5) * MAX_TILT * 2;

        el.style.setProperty("--tilt-x", `${tiltX}deg`);
        el.style.setProperty("--tilt-y", `${-tiltY}deg`);
        el.style.setProperty("--glow-x", `${relX * 100}%`);
        el.style.setProperty("--glow-y", `${relY * 100}%`);
      });

      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });

    // Foto do hero: tilt mais sutil, reagindo ao movimento em toda a seção
    const heroSection = document.getElementById("inicio");
    const heroPhoto = document.querySelector(".image-border");

    if (heroSection && heroPhoto) {
      const MAX_PHOTO_TILT = 10;

      heroSection.addEventListener("mousemove", (event) => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;

        const tiltX = (relX - 0.5) * MAX_PHOTO_TILT * 2;
        const tiltY = (relY - 0.5) * MAX_PHOTO_TILT * 2;

        heroPhoto.style.setProperty("--tilt-x", `${tiltX}deg`);
        heroPhoto.style.setProperty("--tilt-y", `${-tiltY}deg`);
      });

      heroSection.addEventListener("mouseleave", () => {
        heroPhoto.style.setProperty("--tilt-x", "0deg");
        heroPhoto.style.setProperty("--tilt-y", "0deg");
      });
    }
  }

  // ================= LINK ATIVO NO MENU (CONFORME O SCROLL) =================

  const navLinks = document.querySelectorAll("[data-nav-link]");
  const trackedSections = document.querySelectorAll("main section[id]");

  if (navLinks.length && trackedSections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" } // considera "ativa" a seção perto do centro da tela
    );

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  // ================= BOTÃO VOLTAR AO TOPO =================

  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 400);
    };
    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ================= ANIMAÇÃO AO APARECER =================

  const sections = document.querySelectorAll(".section");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // anima apenas uma vez
          }
        });
      },
      { threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    // Fallback: exibe todas as seções sem animação
    sections.forEach((section) => section.classList.add("show"));
  }
  
})();
