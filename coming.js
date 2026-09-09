window.addEventListener("load", () => {

  const svg = document.querySelector(".sub--title");
  const originalPath = svg?.querySelector(":scope > path");

  if (!svg || !originalPath || typeof gsap === "undefined") {
    return;
  }

  const SVG_NS = "http://www.w3.org/2000/svg";


  /* =========================================
     CLEAN PREVIOUS MASK
     useful in Webflow preview / reload
  ========================================= */

  const oldDefs = svg.querySelector(".writing-defs");

  if (oldDefs) {
    oldDefs.remove();
  }

  originalPath.removeAttribute("mask");


  /* =========================================
     CREATE MASK
  ========================================= */

  const defs = document.createElementNS(
    SVG_NS,
    "defs"
  );

  defs.setAttribute(
    "class",
    "writing-defs"
  );


  const mask = document.createElementNS(
    SVG_NS,
    "mask"
  );


  const maskId =
    "sub-title-writing-mask-" +
    Math.random().toString(36).slice(2, 8);


  mask.setAttribute(
    "id",
    maskId
  );


  /*
    Use SVG coordinates directly.
  */

  mask.setAttribute(
    "maskUnits",
    "userSpaceOnUse"
  );


  /*
    White = visible
    Black = hidden
  */

  const blackBackground =
    document.createElementNS(
      SVG_NS,
      "rect"
    );


  const viewBox =
    svg.viewBox.baseVal;


  blackBackground.setAttribute(
    "x",
    viewBox.x
  );

  blackBackground.setAttribute(
    "y",
    viewBox.y
  );

  blackBackground.setAttribute(
    "width",
    viewBox.width
  );

  blackBackground.setAttribute(
    "height",
    viewBox.height
  );

  blackBackground.setAttribute(
    "fill",
    "black"
  );


  mask.appendChild(
    blackBackground
  );


  /* =========================================
     CLONE ORIGINAL PATH
  ========================================= */

  const writePath =
    originalPath.cloneNode(true);


  writePath.removeAttribute("fill");
  writePath.removeAttribute("mask");


  writePath.setAttribute(
    "class",
    "write-mask-path"
  );


  writePath.setAttribute(
    "fill",
    "none"
  );


  writePath.setAttribute(
    "stroke",
    "white"
  );


  writePath.setAttribute(
    "stroke-width",
    "10"
  );


  writePath.setAttribute(
    "stroke-linecap",
    "round"
  );


  writePath.setAttribute(
    "stroke-linejoin",
    "round"
  );


  mask.appendChild(
    writePath
  );


  defs.appendChild(
    mask
  );


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
     PATH LENGTH
  ========================================= */

  const pathLength =
    writePath.getTotalLength();


  gsap.set(writePath, {

    strokeDasharray:
      `${pathLength} ${pathLength}`,

    strokeDashoffset:
      pathLength

  });


  /* =========================================
     INITIAL PAGE STATES
  ========================================= */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });


  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 10
  });


  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 24
  });


  gsap.set(".sub--title", {
    autoAlpha: 1
  });


  gsap.set(
    ".progress--bottom .max--718",
    {
      autoAlpha: 0,
      y: 18
    }
  );


  gsap.set(
    ".image-wrapper.is--progress1",
    {
      autoAlpha: 0,
      y: 28
    }
  );


  gsap.set(
    ".image-wrapper.is--progress2",
    {
      autoAlpha: 0,
      y: 28
    }
  );


  gsap.set(
    ".image-wrapper.is--progress1 img",
    {
      scale: 1.08
    }
  );


  gsap.set(
    ".image-wrapper.is--progress2 img",
    {
      scale: 1.08
    }
  );


  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.85,
    rotation: -7
  });


  /* =========================================
     TIMELINE
  ========================================= */

  const tl = gsap.timeline({

    delay: 0.05,

    defaults: {
      ease: "power3.out"
    }

  });


  /* =========================================
     TAG
  ========================================= */

  tl.to(".title--tag", {

    autoAlpha: 1,

    y: 0,

    duration: 0.35

  });


  /* =========================================
     MAIN HEADING
  ========================================= */

  tl.to(".heading--80", {

    autoAlpha: 1,

    y: 0,

    duration: 0.52,

    ease: "expo.out"

  }, "-=0.12");


  /* =========================================
     HANDWRITTEN SVG
  ========================================= */

  tl.to(writePath, {

    strokeDashoffset: 0,

    duration: 1.45,

    ease: "power1.inOut"

  }, "-=0.05");


  /* =========================================
     PARAGRAPH
  ========================================= */

  tl.to(
    ".progress--bottom .max--718",
    {

      autoAlpha: 1,

      y: 0,

      duration: 0.45,

      ease: "power3.out"

    },

    "-=0.12"

  );


  /* =========================================
     IMAGE 1
  ========================================= */

  tl.to(
    ".image-wrapper.is--progress1",
    {

      autoAlpha: 1,

      y: 0,

      duration: 0.55,

      ease: "expo.out"

    },

    "-=0.05"

  );


  tl.to(
    ".image-wrapper.is--progress1 img",
    {

      scale: 1,

      duration: 0.85,

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

      duration: 0.55,

      ease: "expo.out"

    },

    "-=0.40"

  );


  tl.to(
    ".image-wrapper.is--progress2 img",
    {

      scale: 1,

      duration: 0.85,

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

    duration: 0.6,

    ease: "back.out(1.25)"

  }, "-=0.32");

});