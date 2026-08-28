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
