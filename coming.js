window.addEventListener("load", () => {

  /* =========================================
     ELEMENTS
  ========================================= */

  const paths = gsap.utils.toArray(".subheading-svg path");


  /* =========================================
     SETUP SVG PATHS
  ========================================= */

  paths.forEach((path) => {

    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.set(path, {
      opacity: 1,
      fill: "transparent"
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
    y: 15
  });


  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 40
  });


  gsap.set(".subheading-path-wrapper", {
    autoAlpha: 1
  });


  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 25
  });


  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 50
  });


  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 50
  });


  gsap.set(".image-wrapper.is--progress1 img", {
    scale: 1.15
  });


  gsap.set(".image-wrapper.is--progress2 img", {
    scale: 1.15
  });


  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.7,
    rotation: -15
  });



  /* =========================================
     MAIN TIMELINE
  ========================================= */

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });


  /* -----------------------------------------
     TAG
  ----------------------------------------- */

  tl.to(".title--tag", {
    autoAlpha: 1,
    y: 0,
    duration: 0.7
  });


  /* -----------------------------------------
     MAIN HEADING
  ----------------------------------------- */

  tl.to(".heading--80", {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: "expo.out"
  }, "-=0.3");


  /* =========================================
     REAL PATH WRITING
  ========================================= */

  tl.to(paths, {

    strokeDashoffset: 0,

    duration: 1.25,

    stagger: {
      each: 0.055,
      ease: "none"
    },

    ease: "power1.inOut"

  }, "-=0.25");


  /* =========================================
     FILL THE LETTERS
  ========================================= */

  tl.to(paths, {

    fill: "currentColor",

    duration: 0.5,

    stagger: {
      each: 0.015
    },

    ease: "power2.out"

  }, "-=0.35");


  /* =========================================
     REMOVE OUTLINE
  ========================================= */

  tl.to(paths, {

    strokeOpacity: 0,

    duration: 0.4,

    ease: "power2.out"

  }, "-=0.25");


  /* =========================================
     TEXT
  ========================================= */

  tl.to(".progress--bottom .max--718", {

    autoAlpha: 1,
    y: 0,

    duration: 0.9,

    ease: "power3.out"

  }, "-=0.15");


  /* =========================================
     IMAGE 1
  ========================================= */

  tl.to(".image-wrapper.is--progress1", {

    autoAlpha: 1,
    y: 0,

    duration: 1.1,

    ease: "expo.out"

  }, "-=0.2");


  tl.to(".image-wrapper.is--progress1 img", {

    scale: 1,

    duration: 1.7,

    ease: "power3.out"

  }, "<");


  /* =========================================
     IMAGE 2
  ========================================= */

  tl.to(".image-wrapper.is--progress2", {

    autoAlpha: 1,
    y: 0,

    duration: 1.1,

    ease: "expo.out"

  }, "-=0.75");


  tl.to(".image-wrapper.is--progress2 img", {

    scale: 1,

    duration: 1.7,

    ease: "power3.out"

  }, "<");


  /* =========================================
     STAMP
  ========================================= */

  tl.to(".stamp", {

    autoAlpha: 1,
    scale: 1,
    rotation: 0,

    duration: 1.1,

    ease: "back.out(1.5)"

  }, "-=0.6");

});