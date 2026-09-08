window.addEventListener("load", () => {

  const maskPath =
    document.querySelector(".write-mask-path");

  const svgText =
    document.querySelector(".subheading-write-text");

  const originalHeading =
    document.querySelector(".heading--sub120");


  if (!maskPath || !svgText || !originalHeading) {
    return;
  }


  /* =========================================
     COLOR
  ========================================= */

  const color =
    getComputedStyle(originalHeading).color;

  svgText.style.color = color;


  /* =========================================
     WRITING PATH
  ========================================= */

  const pathLength =
    maskPath.getTotalLength();


  gsap.set(maskPath, {

    strokeDasharray:
      pathLength,

    strokeDashoffset:
      pathLength

  });


  /* =========================================
     INITIAL STATES
  ========================================= */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });


  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 18
  });


  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 40
  });


  gsap.set(".subheading-write-wrapper", {
    autoAlpha: 1
  });


  gsap.set(
    ".progress--bottom .max--718",
    {
      autoAlpha: 0,
      y: 30
    }
  );


  gsap.set(
    ".image-wrapper.is--progress1",
    {
      autoAlpha: 0,
      y: 55
    }
  );


  gsap.set(
    ".image-wrapper.is--progress2",
    {
      autoAlpha: 0,
      y: 55
    }
  );


  gsap.set(
    ".image-wrapper.is--progress1 img",
    {
      scale: 1.14
    }
  );


  gsap.set(
    ".image-wrapper.is--progress2 img",
    {
      scale: 1.14
    }
  );


  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.7,
    rotation: -14
  });



  /* =========================================
     TIMELINE
  ========================================= */

  const tl =
    gsap.timeline({

      delay: 0.2

    });


  /* =========================================
     TAG
  ========================================= */

  tl.to(".title--tag", {

    autoAlpha: 1,

    y: 0,

    duration: 0.7,

    ease: "power3.out"

  });


  /* =========================================
     MAIN HEADING
  ========================================= */

  tl.to(".heading--80", {

    autoAlpha: 1,

    y: 0,

    duration: 1,

    ease: "expo.out"

  }, "-=0.3");


  /* =========================================
     HANDWRITING
  ========================================= */

  tl.to(maskPath, {

    strokeDashoffset: 0,

    duration: 2.6,

    ease: "power1.inOut"

  }, "-=0.15");


  /* =========================================
     PARAGRAPH
  ========================================= */

  tl.to(
    ".progress--bottom .max--718",
    {

      autoAlpha: 1,

      y: 0,

      duration: 0.9,

      ease: "power3.out"

    },

    "-=0.2"

  );


  /* =========================================
     IMAGE 1
  ========================================= */

  tl.to(
    ".image-wrapper.is--progress1",
    {

      autoAlpha: 1,

      y: 0,

      duration: 1.1,

      ease: "expo.out"

    },

    "-=0.15"

  );


  tl.to(
    ".image-wrapper.is--progress1 img",
    {

      scale: 1,

      duration: 1.8,

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

      duration: 1.1,

      ease: "expo.out"

    },

    "-=0.8"

  );


  tl.to(
    ".image-wrapper.is--progress2 img",
    {

      scale: 1,

      duration: 1.8,

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

    duration: 1.15,

    ease: "back.out(1.5)"

  }, "-=0.65");

});