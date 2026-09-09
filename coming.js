window.addEventListener("load", () => {

  /* =========================================
     CHECK GSAP
  ========================================= */

  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded");
    return;
  }


  /* =========================================
     ELEMENTS
  ========================================= */

  const main =
    document.querySelector(".main-wrapper");

  const svg =
    document.querySelector(".sub--title");


  if (!main || !svg) return;


  /*
    IMPORTANT:
    target the paths directly.
    
    No .letter class needed.
  */

  let letters = Array.from(
    svg.querySelectorAll(":scope > g > path")
  );


  /*
    fallback in case SVG structure changes
  */

  if (!letters.length) {

    letters = Array.from(
      svg.querySelectorAll("path")
    ).filter(path => {

      return !path.closest("defs");

    });

  }


  if (!letters.length) {

    console.warn(
      "No drawable paths found inside .sub--title"
    );

    gsap.set(main, {
      autoAlpha: 1
    });

    return;
  }


  /* =========================================
     SORT LEFT → RIGHT
  ========================================= */

  letters.sort((a, b) => {

    try {

      return (
        a.getBBox().x -
        b.getBBox().x
      );

    }

    catch (e) {

      return 0;

    }

  });


  /* =========================================
     INITIAL PAGE STATES
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
     HIDE EVERY SVG PATH
  ========================================= */

  letters.forEach(path => {

    gsap.set(path, {

      clipPath:
        "inset(0 100% 0 0)"

    });

  });


  /* =========================================
     MAIN TIMELINE
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

    duration: 0.32,

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
     
     PATH BY PATH
     LEFT → RIGHT
  ========================================= */

  letters.forEach((path, index) => {

    let width = 20;


    try {

      width =
        path.getBBox().width;

    }

    catch (e) {}


    /*
      Bigger glyphs take slightly longer
    */

    const duration =
      gsap.utils.clamp(

        0.10,

        0.24,

        width / 100

      );


    /*
      Start next letter before previous
      is completely finished.
      
      This gives continuous writing.
    */

    const position =
      index === 0
        ? "-=0.02"
        : "-=0.055";


    tl.to(

      path,

      {

        clipPath:
          "inset(0 0% 0 0)",

        duration,

        ease: "none"

      },

      position

    );

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

    "-=0.04"

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