/* Animations extraites et adaptées au nouveau site.
 * Charger APRES GSAP 3.13.0. ScrollTrigger requis pour les effets au scroll.
 * SplitText facultatif pour load-split, fade-split et fade-scrub.
 * Garder home.js pour les animations spécifiques de la page et les sliders.
 * Aucun changement de dimensions, de typographie ou de structure des cartes.
 * Attribut conseillé : data-animation="fade" (voir les variantes ci-dessous).
 */
(() => {
    "use strict";
    if (window.__siteAnimationsInitialized) return;
    window.__siteAnimationsInitialized = true;
    const select = name => document.querySelectorAll(
      `[data-animation="${name}"], [animation="${name}"], [${name}]`
    );
    const EASE = "power4.out";
  function initButtonCharacterStagger() {
    const offsetIncrement = 0.01; // Transition offset increment in seconds
    const buttons = document.querySelectorAll("[data-button-animate-chars]");
  
    buttons.forEach((button) => {
      if (button.dataset.charsReady) return;
      button.dataset.charsReady = "true";
      const text = button.textContent; // Get the button's text content
      button.setAttribute("aria-label", text.trim());
      button.innerHTML = ""; // Clear the original content
  
      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.setAttribute("aria-hidden", "true");
        span.style.transitionDelay = `${index * offsetIncrement}s`;
  
        // Handle spaces explicitly
        if (char === " ") {
          span.style.whiteSpace = "pre"; // Preserve space width
        }
  
        button.appendChild(span);
      });
    });
  }
  
  function initButtonDirectionalBg() {
    const directionMap = {
      top: "translateY(-100%)",
      bottom: "translateY(100%)",
      left: "translateX(-100%)",
      right: "translateX(100%)",
    };
  
    function getDirection(event, el) {
      const { left, top, width: w, height: h } = el.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
  
      const distances = {
        top: y,
        right: w - x,
        bottom: h - y,
        left: x,
      };
  
      return Object.entries(distances).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
    }
  
    document.querySelectorAll(".button, .btn-animate-chars").forEach((btn) => {
      const bg = btn.querySelector(".btn-animate-chars__bg");
      if (!bg) return;
  
      btn.addEventListener("mouseenter", (e) => {
        const dir = getDirection(e, btn);
        bg.style.transition = "none";
        bg.style.transform = directionMap[dir] || "translate(0, 0)";
        void bg.offsetHeight;
        bg.style.transition = "";
        bg.style.transform = "translate(0%, 0%)";
      });
  
      btn.addEventListener("mouseleave", (e) => {
        const dir = getDirection(e, btn);
        bg.style.transform = directionMap[dir] || "translate(0, 0)";
      });
    });
  }
  
  function initDirectionalListHover() {
    const directionMap = {
      top: "translateY(-100%)",
      bottom: "translateY(100%)",
      left: "translateX(-100%)",
      right: "translateX(100%)",
    };
  
    document.querySelectorAll("[data-directional-hover]").forEach((container) => {
      const type = container.getAttribute("data-type") || "all";
  
      container
        .querySelectorAll("[data-directional-hover-item]")
        .forEach((item) => {
          const tile = item.querySelector("[data-directional-hover-tile]");
          if (!tile) return;
  
          item.addEventListener("mouseenter", (e) => {
            const dir = getDirection(e, item, type);
            tile.style.transition = "none";
            tile.style.transform = directionMap[dir] || "translate(0, 0)";
            void tile.offsetHeight;
            tile.style.transition = "";
            tile.style.transform = "translate(0%, 0%)";
            item.setAttribute("data-status", `enter-${dir}`);
          });
  
          item.addEventListener("mouseleave", (e) => {
            const dir = getDirection(e, item, type);
            item.setAttribute("data-status", `leave-${dir}`);
            tile.style.transform = directionMap[dir] || "translate(0, 0)";
          });
        });
  
      function getDirection(event, el, type) {
        const { left, top, width: w, height: h } = el.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
  
        if (type === "y") return y < h / 2 ? "top" : "bottom";
        if (type === "x") return x < w / 2 ? "left" : "right";
  
        const distances = {
          top: y,
          right: w - x,
          bottom: h - y,
          left: x,
        };
  
        return Object.entries(distances).reduce((a, b) =>
          a[1] < b[1] ? a : b,
        )[0];
      }
    });
  }
  
  function initServiceRowsScroll() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;
  
    const serviceRows = document.querySelectorAll(".service-row");
    if (!serviceRows.length) return;
  
    gsap.set(serviceRows, { transformOrigin: "center center" });
    serviceRows.forEach((row) => {
      gsap.fromTo(
        row,
        { scale: 0.8 },
        {
          scale: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "top center",
            scrub: 0.6,
          },
        },
      );
    });
  }
  
  function initFooterParallax() {
    document.querySelectorAll("[data-footer-parallax]").forEach((el) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "clamp(top bottom)",
          end: "clamp(top top)",
          scrub: true,
        },
      });
  
      const inner = el.querySelector("[data-footer-parallax-inner]");
      const dark = el.querySelector("[data-footer-parallax-dark]");
  
      if (inner) {
        tl.from(inner, {
          yPercent: -25,
          ease: "linear",
        });
      }
  
      if (dark) {
        tl.from(
          dark,
          {
            opacity: 0.5,
            ease: "linear",
          },
          "<",
        );
      }
    });
  }
    function initMotion() {
      const gsap = window.gsap;
      if (!gsap) return; // Pas de masquage CSS : contenu lisible sans GSAP.
      const hasScroll = Boolean(window.ScrollTrigger);
      if (hasScroll) gsap.registerPlugin(window.ScrollTrigger);
      if (window.SplitText) gsap.registerPlugin(window.SplitText);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splits = [];
        const motions = [];
        const revealed = new WeakSet();
        const variants = [
          ["load", {opacity: 0, y: "1rem"}],
          ["load-left", {opacity: 0, x: "1rem"}],
          ["load-right", {opacity: 0, x: "-1rem"}],
          ["fade", {opacity: 0, y: "1em"}],
          ["fade-left", {opacity: 0, x: "1rem"}],
          ["fade-right", {opacity: 0, x: "-1rem"}]
        ];
        variants.forEach(([name, from]) => {
          const scrolling = name.startsWith("fade");
          if (scrolling && !hasScroll) return;
          select(name).forEach(el => gsap.fromTo(el, from, {
            opacity: 1, x: 0, y: 0, duration: 0.6, ease: EASE,
            ...(scrolling ? {scrollTrigger: {trigger: el, start: "top bottom", once: true}} : {delay: 0.3})
          }));
        });
        if (hasScroll) {
          select("fade-stagger").forEach(el => {
            if (!el.children.length) return;
            gsap.fromTo(el.children, {opacity: 0, y: "1em"}, {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: EASE,
              scrollTrigger: {trigger: el, start: "top bottom", once: true}
            });
          });
          initServiceRowsScroll();
          initFooterParallax();
        }
        // Reconstruire les lignes après un changement de largeur.
        function buildText() {
          motions.splice(0).forEach(tween => {
            tween.scrollTrigger?.kill();
            tween.revert();
          });
          splits.splice(0).forEach(split => split.revert());
          ["load-split", "fade-split", "fade-scrub"].forEach(name => {
            if (name !== "load-split" && !hasScroll) return;
            select(name).forEach(el => {
              const scrub = name === "fade-scrub";
              if (!scrub && revealed.has(el)) return;
              let split;
              if (window.SplitText) {
                try {
                  split = window.SplitText.create(el, scrub
                    ? {type: "words", wordsClass: "fade-scrub__word", tag: "span"}
                    : {type: "lines", linesClass: `${name}__line`, mask: "lines"});
                  splits.push(split);
                } catch (error) { console.warn("SplitText :", error); }
              }
              const targets = split ? (scrub ? split.words : split.lines) : el;
              const from = scrub ? {opacity: 0.2, filter: "blur(2rem)"} : {opacity: 0, yPercent: 100};
              motions.push(gsap.fromTo(targets, from, {
                opacity: 1, ...(scrub ? {filter: "blur(0px)"} : {yPercent: 0}),
                duration: 0.6, stagger: 0.1, ease: scrub ? "none" : EASE,
                onComplete: () => { if (!scrub) revealed.add(el); },
                ...(name === "load-split" ? {delay: 0.3} : {
                  scrollTrigger: {trigger: el, start: scrub ? "top 80%" : "top bottom",
                    ...(scrub ? {end: "bottom 40%", scrub: true} : {once: true})}
                })
              }));
            });
          });
        }
        buildText();
        let width = window.innerWidth;
        let timer;
        const resize = () => {
          if (width === window.innerWidth) return;
          width = window.innerWidth;
          clearTimeout(timer);
          timer = setTimeout(() => { buildText(); if (hasScroll) window.ScrollTrigger.refresh(); }, 200);
        };
        window.addEventListener("resize", resize);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("resize", resize);
          motions.splice(0).forEach(t => { t.scrollTrigger?.kill(); t.revert(); });
          splits.splice(0).forEach(s => s.revert());
        };
      });
      if (hasScroll) {
        if (document.readyState === "complete") window.ScrollTrigger.refresh();
        else window.addEventListener("load", () => window.ScrollTrigger.refresh(), {once: true});
      }
    }
    function init() {
      if (document.documentElement.matches(".wf-design-mode, .wf-editor")) return;
      initButtonCharacterStagger();
      initButtonDirectionalBg();
      initDirectionalListHover();
      if (document.fonts?.ready) document.fonts.ready.then(initMotion);
      else initMotion();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
    else init();
  })();
  