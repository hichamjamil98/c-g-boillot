window.addEventListener("load", () => {

  if (typeof gsap === "undefined") return;


  /* =========================================
     ELEMENTS
  ========================================= */

  const svg = document.querySelector(".sub--title");

  if (!svg) return;

  const originalPath =
    svg.querySelector(":scope > path");

  if (!originalPath) return;


  const SVG_NS =
    "http://www.w3.org/2000/svg";


  /* =========================================
     REMOVE OLD GENERATED MASK
  ========================================= */

  const oldDefs =
    svg.querySelector(".sub-writing-defs");

  if (oldDefs) {
    oldDefs.remove();
  }

  originalPath.removeAttribute("mask");


  /* =========================================
     GET VIEWBOX
  ========================================= */

  const viewBox = svg.viewBox.baseVal;

  const svgX = viewBox.x;
  const svgY = viewBox.y;
  const svgWidth = viewBox.width;
  const svgHeight = viewBox.height;


  /* =========================================
     CREATE DEFS
  ========================================= */

  const defs =
    document.createElementNS(
      SVG_NS,
      "defs"
    );

  defs.setAttribute(
    "class",
    "sub-writing-defs"
  );


  /* =========================================
     SOFT EDGE FILTER
  ========================================= */

  const filter =
    document.createElementNS(
      SVG_NS,
      "filter"
    );

  filter.setAttribute(
    "id",
    "sub-writing-blur"
  );

  filter.setAttribute(
    "x",
    "-50%"
  );

  filter.setAttribute(
    "width",
    "200%"
  );


  const blur =
    document.createElementNS(
      SVG_NS,
      "feGaussianBlur"
    );

  blur.setAttribute(
    "stdDeviation",
    "2"
  );


  filter.appendChild(blur);

  defs.appendChild(filter);


  /* =========================================
     MASK
  ========================================= */

  const mask =
    document.createElementNS(
      SVG_NS,
      "mask"
    );

  const maskId =
    "sub-writing-mask";

  mask.setAttribute(
    "id",
    maskId
  );

  mask.setAttribute(
    "maskUnits",
    "userSpaceOnUse"
  );


  /* =========================================
     MAIN REVEAL RECT
  ========================================= */

  const revealRect =
    document.createElementNS(
      SVG_NS,
      "rect"
    );

  revealRect.setAttribute(
    "class",
    "sub-writing-mask-rect"
  );

  revealRect.setAttribute(
    "x",
    svgX
  );

  revealRect.setAttribute(
    "y",
    svgY - 5
  );

  revealRect.setAttribute(
    "width",
    "0"
  );

  revealRect.setAttribute(
    "height",
    svgHeight + 10
  );

  revealRect.setAttribute(
    "fill",
    "white"
  );


  mask.appendChild(revealRect);


  /* =========================================
     SOFT PEN EDGE
  ========================================= */

  const edge =
    document.createElementNS(
      SVG_NS,
      "rect"
    );

  edge.setAttribute(
    "class",
    "sub-writing-edge"
  );

  edge.setAttribute(
    "x",
    svgX
  );

  edge.setAttribute(
    "y",
    svgY - 10
  );

  edge.setAttribute(
    "width",
    "12"
  );

  edge.setAttribute(
    "height",
    svgHeight + 20
  );

  edge.setAttribute(
    "fill",
    "white"
  );

  edge.setAttribute(
    "filter",
    "url(#sub-writing-blur)"
  );


  mask.appendChild(edge);

  defs.appendChild(mask);

  svg.insertBefore(
    defs,
    svg.firstChild
  );


  /* =========================================
     APPLY MASK
  ========================================= */

  originalPath.setAttribute(
    "mask",
    `url(#${maskId})`
  );


  /* =========================================
     INITIAL STATES
  ========================================= */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });


  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 8
  });


  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 20
  });


  gsap.set(".sub--title", {
    autoAlpha: 1
  });


  gsap.set(revealRect, {
    attr: {
      width: 0
    }
  });


  gsap.set(edge, {
    x: 0,
    autoAlpha: 1
  });


  gsap.set(
    ".progress--bottom .max--718",
    {
      autoAlpha: 0,
      y: 15
    }
  );


  gsap.set(
    ".image-wrapper.is--progress1",
    {
      autoAlpha: 0,
      y: 22
    }
  );


  gsap.set(
    ".image-wrapper.is--progress2",
    {
      autoAlpha: 0,
      y: 22
    }
  );


  gsap.set(
    ".image-wrapper.is--progress1 img",
    {
      scale: 1.06
    }
  );


  gsap.set(
    ".image-wrapper.is--progress2 img",
    {
      scale: 1.06
    }
  );


  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.88,
    rotation: -5
  );


  /* =========================================
     TIMELINE
  ========================================= */

  const tl =
    gsap.timeline({

      delay: 0.05,

      defaults: {
        ease: "power3.out"
      }

    });


  /* =========================================
     C&G BOILLOT
  ========================================= */

  tl.to(".title--tag", {

    autoAlpha: 1,

    y: 0,

    duration: 0.32

  });


  /* =========================================
     NOTRE NOUVEAU SITE
  ========================================= */

  tl.to(".heading--80", {

    autoAlpha: 1,

    y: 0,

    duration: 0.46,

    ease: "expo.out"

  }, "-=0.12");


  /* =========================================
     ARRIVE BIENTÔT
     CONTINUOUS PEN WRITING
  ========================================= */

  tl.to(revealRect, {

    attr: {
      width: svgWidth
    },

    duration: 1.65,

    /*
      quasiment linéaire :
      donne une impression de main qui écrit
    */
    ease: "none"

  }, "-=0.03");


  /*
    la pointe douce suit exactement
    le bord du reveal
  */

  tl.to(edge, {

    x: svgWidth - 8,

    duration: 1.65,

    ease: "none"

  }, "<");


  /*
    léger fade de la pointe quand
    l'écriture est terminée
  */

  tl.to(edge, {

    autoAlpha: 0,

    duration: 0.15

  });


  /* =========================================
     PARAGRAPH
  ========================================= */

  tl.to(
    ".progress--bottom .max--718",
    {

      autoAlpha: 1,

      y: 0,

      duration: 0.4,

      ease: "power3.out"

    },

    "-=0.08"

  );


  /* =========================================
     IMAGE 1
  ========================================= */

  tl.to(
    ".image-wrapper.is--progress1",
    {

      autoAlpha: 1,

      y: 0,

      duration: 0.48,

      ease: "expo.out"

    },

    "-=0.05"

  );


  tl.to(
    ".image-wrapper.is--progress1 img",
    {

      scale: 1,

      duration: 0.78,

      ease: "power3.out"

    },

    "<"

  );


  /* =========================================
     IMAGE 2
  ========================================= */

  tl.to(
    ".image-wrapper.is--progress2",
    {

      autoAlpha: 1,

      y: 0,

      duration: 0.48,

      ease: "expo.out"

    },

    "-=0.35"

  );


  tl.to(
    ".image-wrapper.is--progress2 img",
    {

      scale: 1,

      duration: 0.78,

      ease: "power3.out"

    },

    "<"

  );


  /* =========================================
     STAMP
  ========================================= */

  tl.to(".stamp", {

    autoAlpha: 1,

    scale: 1,

    rotation: 0,

    duration: 0.5,

    ease: "back.out(1.2)"

  }, "-=0.28");

});