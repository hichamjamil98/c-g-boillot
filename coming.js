window.addEventListener("load", () => {

  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded");
    return;
  }


  /* =========================================
     ELEMENTS
  ========================================= */

  const main =
    document.querySelector(".main-wrapper");

  const subtitle =
    document.querySelector(".sub--title");


  if (!main || !subtitle) return;


  /* =========================================
     INITIAL STATES
  ========================================= */

  gsap.set(main, {
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


  /* SVG initial mask */

  gsap.set(subtitle, {
    webkitMaskPosition: "100% 0%",
    maskPosition: "100% 0%"
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
  });


  /* =========================================
     TIMELINE
  ========================================= */

  const tl = gsap.timeline({
    delay: 0.05
  });


  /* =========================================
     C&G BOILLOT
  ========================================= */

  tl.to(".title--tag", {

    autoAlpha: 1,
    y: 0,

    duration: 0.34,

    ease: "power3.out"

  });


  /* =========================================
     NOTRE NOUVEAU SITE
  ========================================= */

  tl.to(".heading--80", {

    autoAlpha: 1,
    y: 0,

    duration: 0.48,

    ease: "expo.out"

  }, "-=0.12");


  /* =========================================
     ARRIVE BIENTÔT
     SMOOTH PEN REVEAL
  ========================================= */

  tl.to(subtitle, {

    webkitMaskPosition: "0% 0%",
    maskPosition: "0% 0%",

    duration: 1.85,

    ease: "sine.inOut"

  }, "-=0.02");


  /* remove mask after completion */

  tl.set(subtitle, {
    webkitMaskImage: "none",
    maskImage: "none"
  });


  /* =========================================
     PARAGRAPH
  ========================================= */

  tl.to(
    ".progress--bottom .max--718",
    {

      autoAlpha: 1,
      y: 0,

      duration: 0.42,

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

      duration: 0.5,

      ease: "expo.out"

    },

    "-=0.05"

  );


  tl.to(
    ".image-wrapper.is--progress1 img",
    {

      scale: 1,

      duration: 0.82,

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

      duration: 0.5,

      ease: "expo.out"

    },

    "-=0.36"

  );


  tl.to(
    ".image-wrapper.is--progress2 img",
    {

      scale: 1,

      duration: 0.82,

      ease: "power3.out"

    },

    "<"

  );


  /* =========================================
     STAMP
  ========================================= */

  tl.to(
    ".stamp",
    {

      autoAlpha: 1,

      scale: 1,
      rotation: 0,

      duration: 0.52,

      ease: "back.out(1.2)"

    },

    "-=0.28"

  );

});