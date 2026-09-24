/* ==================== Site Animations ====================
 * Load after GSAP, ScrollTrigger and optional SplitText.
 * Keep home.js for page-specific sliders.
 */
(() => {
  "use strict";
  if (window.__siteAnimationsInitialized) return;
  window.__siteAnimationsInitialized = true;
  const select = name => document.querySelectorAll(
    `[data-animation="${name}"], [animation="${name}"], [${name}]`
  );
  const EASE = "power4.out";
// -------------------- Button Character Stagger --------------------
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

// -------------------- Directional Button Background --------------------
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

// -------------------- Directional List Hover --------------------
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

// -------------------- Service Row Scroll Scale --------------------
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

// -------------------- Footer Parallax --------------------
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

// -------------------- Image Scroll Parallax --------------------
function initImageParallax() {
  const parents = new Set();
  document.querySelectorAll('img[data-animation="parallax"]').forEach(img => {
    // For <picture>, clip its containing image wrapper.
    const parent = img.parentElement?.tagName === "PICTURE"
      ? img.parentElement.parentElement : img.parentElement;
    if (!parent) return;
    if (!parent.classList.contains("is--parallax-clip")) {
      parent.classList.add("is--parallax-clip");
      parents.add(parent);
    }
    // A small visual zoom prevents empty edges. Layout dimensions stay intact.
    gsap.fromTo(img,
      {yPercent: -6, scale: 1.16, transformOrigin: "50% 50%"},
      {
        yPercent: 6,
        scale: 1.16,
        ease: "none",
        scrollTrigger: {
          trigger: parent,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      }
    );
  });
  return () => parents.forEach(parent => parent.classList.remove("is--parallax-clip"));
}

// -------------------- Navbar Scroll State --------------------
function initNavbarScroll() {
  const navbars = [...document.querySelectorAll(".navbar")];
  if (!navbars.length) return;
  let pending = false;
  const update = () => {
    const scrolled = window.scrollY > 0;
    navbars.forEach(navbar => navbar.classList.toggle("is--scrolled", scrolled));
    pending = false;
  };
  window.addEventListener("scroll", () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }, {passive: true});
  window.addEventListener("pageshow", update);
  update();
}

// -------------------- Width Reveal on Scroll --------------------
function initGrowAnimations() {
  document.querySelectorAll('[data-animation="grow"]').forEach(el => {
    gsap.fromTo(el, {width: "0%"}, {
      width: "100%",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: {trigger: el.parentElement || el, start: "top 85%", once: true}
    });
  });
}

// -------------------- Smooth Tablet and Mobile Navigation --------------------
function initMobileNavbar() {
  if (!window.gsap) return;
  const gsap = window.gsap;
  const media = window.matchMedia("(max-width: 991px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll(".navbar").forEach((navbar, index) => {
    const trigger = navbar.querySelector(".menu--trigger");
    const menu = navbar.querySelector(".nav--menu");
    if (!trigger || !menu) return;
    navbar.classList.remove("is--menu-active", "is--menu-open");
    navbar.classList.add("is--menu-ready");

    // Keep the original header and logo in their Webflow positions.
    const panel = document.createElement("div");
    panel.className = "site-mobile-menu";
    panel.id = `site-mobile-menu-${index}`;
    panel.setAttribute("aria-label", "Mobile navigation");
    panel.setAttribute("role", "navigation");
    const list = document.createElement("div");
    list.className = "site-mobile-menu__links";
    [...menu.children].filter(el => !el.matches(".nav--brand")).forEach(el => {
      const clone = el.cloneNode(true);
      [clone, ...clone.querySelectorAll("[id]")].forEach(node => node.removeAttribute("id"));
      list.appendChild(clone);
    });
    if (!list.querySelector("a[href]")) return;
    panel.appendChild(list);
    document.body.appendChild(panel);
    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Open menu");
    if (trigger.tagName === "BUTTON") trigger.type = "button";
    else { trigger.setAttribute("role", "button"); trigger.setAttribute("tabindex", "0"); }
    const openIcon = trigger.querySelector(".menu--to-open");
    const closeIcon = trigger.querySelector(".menu--to-close");
    let open = false;
    let locked = false;
    let savedOverflow;
    let savedPriority;
    let afterClose = null;
    const unlock = () => {
      if (!locked) return;
      if (savedOverflow) document.body.style.setProperty("overflow", savedOverflow, savedPriority);
      else document.body.style.removeProperty("overflow");
      locked = false;
    };
    const finishClose = () => {
      if (open) return;
      navbar.classList.remove("is--menu-open");
      panel.inert = true;
      panel.setAttribute("aria-hidden", "true");
      unlock();
      const action = afterClose;
      afterClose = null;
      if (action) action();
    };
    gsap.set(panel, {autoAlpha: 0, y: -16});
    gsap.set(list.children, {opacity: 0, y: 16});
    if (closeIcon) gsap.set(closeIcon, {autoAlpha: 0, rotate: -45, scale: 0.8});
    if (openIcon) gsap.set(openIcon, {autoAlpha: 1, rotate: 0, scale: 1});
    const tl = gsap.timeline({paused: true, onReverseComplete: finishClose});
    tl.to(panel, {autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out"}, 0)
      .to(list.children, {opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power3.out"}, 0.12);
    if (openIcon) tl.to(openIcon, {autoAlpha: 0, rotate: 45, scale: 0.8, duration: 0.25}, 0);
    if (closeIcon) tl.to(closeIcon, {autoAlpha: 1, rotate: 0, scale: 1, duration: 0.3}, 0.08);

    const close = (focus = true, instant = false, action = null) => {
      open = false;
      afterClose = action;
      panel.inert = true;
      panel.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-label", "Open menu");
      if (focus) trigger.focus({preventScroll: true});
      if (instant || reduced.matches || tl.progress() === 0) {
        tl.pause(0, true);
        finishClose();
      } else tl.timeScale(1.4).reverse();
    };
    const show = () => {
      if (!media.matches) return;
      open = true;
      afterClose = null;
      if (!locked) {
        savedOverflow = document.body.style.getPropertyValue("overflow");
        savedPriority = document.body.style.getPropertyPriority("overflow");
        document.body.style.setProperty("overflow", "hidden");
        locked = true;
      }
      // Measure header clearance without moving the header.
      const bottom = Math.max(0, navbar.getBoundingClientRect().bottom);
      panel.style.setProperty("--menu-header-space", `${bottom + 24}px`);
      navbar.classList.add("is--menu-open");
      panel.inert = false;
      panel.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-label", "Close menu");
      if (reduced.matches) tl.progress(1).pause();
      else tl.timeScale(1).play();
    };
    trigger.addEventListener("click", event => {
      if (!media.matches) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (open) close(); else show();
    }, true);
    trigger.addEventListener("keydown", event => {
      if (!media.matches || trigger.tagName === "BUTTON") return;
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); trigger.click(); }
    });
    panel.addEventListener("click", event => {
      const link = event.target.closest("a[href]");
      if (!open || !link || event.defaultPrevented) return;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
          link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const href = link.getAttribute("href");
      event.preventDefault();
      close(true, false, href && href !== "#" ? () => window.location.assign(link.href) : null);
    });
    document.addEventListener("keydown", event => {
      if (!open) return;
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab") return;
      const targets = [trigger, ...panel.querySelectorAll('a[href], button, [tabindex="0"]')]
        .filter(el => el.getClientRects().length && !el.disabled);
      const first = targets[0], last = targets[targets.length - 1];
      if (!first) return;
      const active = document.activeElement;
      if (!targets.includes(active) || (!event.shiftKey && active === last)) {
        event.preventDefault(); first.focus();
      } else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
    });
    media.addEventListener("change", () => close(false, true));
    window.addEventListener("pageshow", () => close(false, true));
  });
}

// -------------------- Load and Scroll Animations --------------------
function initMotion() {
    const gsap = window.gsap;
    if (!gsap) return; // Content stays visible when GSAP is unavailable.
    const hasScroll = Boolean(window.ScrollTrigger);
    if (hasScroll) gsap.registerPlugin(window.ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let cleanupParallax = () => {};
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
        initGrowAnimations();
        initServiceRowsScroll();
        initFooterParallax();
        cleanupParallax = initImageParallax();
      }
      // Rebuild text lines when the viewport width changes.
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
        cleanupParallax();
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
    initNavbarScroll();
    initMobileNavbar();
    initButtonCharacterStagger();
    initButtonDirectionalBg();
    initDirectionalListHover();
    if (document.fonts?.ready) document.fonts.ready.then(initMotion);
    else initMotion();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
  else init();
})();

// -------------------- Sequential SVG Path Drawing --------------------
(() => {
"use strict";
const initialized = new WeakSet();
const NS = "http://www.w3.org/2000/svg";
const number = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;

// Split M/m commands while preserving relative coordinates.
function splitPath(shape) {
  const d = shape.getAttribute("d") || "";
  const chunks = d.match(/[Mm][^Mm]*/g) || [];
  let prefix = "";
  const probe = document.createElementNS(NS, "path");
  return chunks.map(chunk => {
    let result = chunk;
    if (chunk[0] === "m") {
      const pair = chunk.match(/^m\s*([-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?)\s*,?\s*([-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?)/i);
      if (!pair) throw new Error("Mouvement SVG relatif non reconnu");
      let point = {x: 0, y: 0};
      if (prefix) {
        probe.setAttribute("d", prefix);
        point = probe.getPointAtLength(probe.getTotalLength());
      }
      // Additional coordinate pairs after m remain relative lines.
      const remainder = chunk.slice(pair[0].length);
      result = `M${point.x + Number(pair[1])} ${point.y + Number(pair[2])}` +
        (/^\s*,?\s*[-+.\d]/.test(remainder) ? " l" + remainder.replace(/^\s*,/, " ") : remainder);
    }
    prefix += chunk;
    return result;
  });
}

function init() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (document.documentElement.matches(".wf-design-mode, .wf-editor")) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  document.querySelectorAll('svg[animation="trace"]').forEach(svg => {
    if (initialized.has(svg)) return;
    initialized.add(svg);
    const duration = number(svg.dataset.traceDuration, 1.8);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const originals = [];
      const strokes = [];
      const cleanup = () => {
        strokes.forEach(({node}) => node.remove());
        originals.forEach(({shape, style}) => {
          if (style === null) shape.removeAttribute("style");
          else shape.setAttribute("style", style);
        });
      };
      const shapes = [...svg.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect")];
      shapes.forEach(shape => {
        if (shape.closest("defs, clipPath, mask, symbol") || shape.closest("svg") !== svg) return;
        const cs = getComputedStyle(shape);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
        const filled = cs.fill !== "none" && Number(cs.fillOpacity) > 0;
        const stroked = cs.stroke !== "none" && Number(cs.strokeOpacity) > 0;
        if (!filled && !stroked) return;
        const parts = [];
        try {
          const chunks = shape.tagName.toLowerCase() === "path" ? splitPath(shape) : [null];
          chunks.forEach(d => {
            const node = shape.cloneNode(false);
            node.removeAttribute("id");
            node.removeAttribute("class");
            node.removeAttribute("style");
            node.removeAttribute("pathLength");
            if (d !== null) node.setAttribute("d", d);
            node.setAttribute("aria-hidden", "true");
            node.style.pointerEvents = "none";
            node.style.fill = "none";
            node.style.stroke = stroked ? cs.stroke : cs.fill;
            node.style.strokeWidth = svg.dataset.traceWidth || (stroked ? cs.strokeWidth : "1");
            node.style.strokeLinecap = "round";
            node.style.strokeLinejoin = "round";
            node.style.opacity = cs.opacity;
            node.style.strokeOpacity = stroked ? cs.strokeOpacity : cs.fillOpacity;
            node.style.transform = cs.transform;
            node.style.transformOrigin = cs.transformOrigin;
            node.style.transformBox = cs.transformBox;
            node.style.transition = "none";
            shape.parentNode.insertBefore(node, shape);
            parts.push({node, length: 0});
            const length = node.getTotalLength();
            if (!Number.isFinite(length) || length <= 0) {
              node.remove(); parts.pop(); return;
            }
            parts[parts.length - 1].length = length;
            node.style.strokeDasharray = `${length} ${length}`;
            node.style.strokeDashoffset = String(length);
          });
        } catch (error) {
          parts.forEach(({node}) => node.remove());
          console.warn("SVG trace : forme laissée visible", error);
          return;
        }
        if (!parts.length) return;
        originals.push({shape, style: shape.getAttribute("style"), opacity: Number(cs.opacity)});
        strokes.push(...parts);
        gsap.set(shape, {opacity: 0});
      });
      if (!strokes.length) return;
      const total = strokes.reduce((sum, item) => sum + item.length, 0);
      const tl = gsap.timeline({
        scrollTrigger: {trigger: svg, start: "top 85%", once: true},
        onComplete: cleanup
      });
      // Draw each subpath sequentially at a constant speed.
      strokes.forEach(({node, length}) => {
        tl.to(node, {strokeDashoffset: 0, duration: duration * length / total, ease: "none"});
      });
      originals.forEach(({shape, opacity}) => {
        tl.to(shape, {opacity, duration: 0.3, ease: "power1.inOut"}, duration);
      });
      tl.to(strokes.map(item => item.node), {opacity: 0, duration: 0.3, ease: "power1.inOut"}, duration);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); cleanup(); };
    });
  });
  if (document.readyState === "complete") window.ScrollTrigger.refresh();
  else window.addEventListener("load", () => window.ScrollTrigger.refresh(), {once: true});
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
else init();
})();
