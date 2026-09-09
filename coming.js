window.addEventListener("load", () => {

  if (typeof gsap === "undefined") return;


  /* =========================================
     ELEMENTS
  ========================================= */

  const svg = document.querySelector(".sub--title");

  if (!svg) return;

  const letters = Array.from(
    svg.querySelectorAll(".letter")
  );

  if (!letters.length) return;


  const SVG_NS =
    "http://www.w3.org/2000/svg";


  /* =========================================
     CLEAN OLD GENERATED DEFS
  ========================================= */

  const oldDefs =
    svg.querySelector(".letter-animation-defs");

  if (oldDefs) {
    oldDefs.remove();
  }


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
    "letter-animation-defs"
  );


  svg.insertBefore(
    defs,
    svg.firstChild
  );


  /* =========================================
     CREATE ONE CLIP FOR EACH LETTER
  ========================================= */

  const reveals = [];


  letters.forEach((letter, index) => {

    const box = letter.getBBox();

    const padding = 3;


    /* -------------------------
       clipPath
    ------------------------- */

    const clipPath =
      document.createElementNS(
        SVG_NS,
        "clipPath"
      );


    const clipId =
      `letter-reveal-${index}`;


    clipPath.setAttribute(
      "id",
      clipId
    );


    clipPath.setAttribute(
      "clipPathUnits",
      "userSpaceOnUse"
    );


    /* -------------------------
       reveal rect
    ------------------------- */

    const rect =
      document.createElementNS(
        SVG_NS,
        "rect"
      );


    rect.setAttribute(
      "class",
      "letter-reveal-rect"
    );


    rect.setAttribute(
      "x",
      box.x - padding
    );


    rect.setAttribute(
      "y",
      box.y - padding
    );


    rect.setAttribute(
      "width",
      "0"
    );


    rect.setAttribute(
      "height",
      box.height + padding * 2
    );


    clipPath.appendChild(rect);

    defs.appendChild(clipPath);


    /* -------------------------
       apply clip
    ------------------------- */

    letter.setAttribute(
      "clip-path",
      `url(#${clipId})`
    );


    reveals.push({
      rect,
      box,
      width: box.width + padding * 2
    });

  });


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


  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 15
  });


  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 22
  });


  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 22
  });


  gsap.set(".image-wrapper.is--progress1 img", {
    scale: 1.06
  });


  gsap.set(".image-wrapper.is--progress2 img", {
    scale: 1.06
  });


  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.88,
    rotation: -5
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

    duration: 0.46,

    ease: "expo.out"

  }, "-=0.12");


  /* =========================================
     ARRIVE BIENTÔT
     LETTER BY LETTER
  ========================================= */

  const writingStart =
    tl.duration() - 0.03;


  reveals.forEach((item, index) => {

    /*
      letters are not all same width,
      so duration follows their size
    */

    const duration =
      gsap.utils.clamp(
        0.09,
        0.26,
        item.box.width / 95
      );


    /*
      small overlap between letters:
      gives continuous pen feeling
    */

    const overlap =
      0.045;


    const start =
      index === 0
        ? writingStart
        : `>-=${overlap}`;


    tl.to(
      item.rect,
      {

        attr: {
          width: item.width
        },

        duration: duration,

        ease: "none"

      },
      start
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

      duration: 0.4,

      ease: "power3.out"

    },

    "-=0.05"

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

  tl.to(
    ".stamp",
    {

      autoAlpha: 1,

      scale: 1,

      rotation: 0,

      duration: 0.5,

      ease: "back.out(1.2)"

    },

    "-=0.28"

  );

});