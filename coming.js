window.addEventListener("load", () => {

  /* =========================================
     SAFETY
  ========================================= */

  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded.");
    return;
  }


  /* =========================================
     ELEMENTS
  ========================================= */

  const main = document.querySelector(".main-wrapper");
  const svg = document.querySelector(".sub--title");

  if (!main || !svg) return;


  const letters = Array.from(
    svg.querySelectorAll(".letter")
  );


  if (!letters.length) {
    console.warn(
      "No .letter elements found inside .sub--title"
    );

    gsap.set(main, {
      autoAlpha: 1
    });

    return;
  }


  /* =========================================
     INITIAL STATES
  ========================================= */

  gsap.set(main, {
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


  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 18
  });


  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 24
  });


  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 24
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
     LETTER INITIAL STATE
  ========================================= */

  letters.forEach((letter) => {

    gsap.set(letter, {
      clipPath: "inset(0 100% 0 0)"
    });

  });


  /* =========================================
     MAIN TIMELINE
  ========================================= */

  const tl = gsap.timeline({
    delay: 0.05
  });


  /* =========================================
     TAG
  ========================================= */

  tl.to(".title--tag", {

    autoAlpha: 1,
    y: 0,

    duration: 0.34,

    ease: "power3.out"

  });


  /* =========================================
     HEADING
  ========================================= */

  tl.to(".heading--80", {

    autoAlpha: 1,
    y: 0,

    duration: 0.5,

    ease: "expo.out"

  }, "-=0.12");


  /* =========================================
     HANDWRITING
     LETTER BY LETTER
  ========================================= */

  letters.forEach((letter, index) => {

    /*
      wider letters take slightly longer
    */

    let duration = 0.15;


    try {

      const box = letter.getBBox();

      duration = gsap.utils.clamp(
        0.11,
        0.22,
        box.width / 120
      );

    } catch (e) {

      duration = 0.15;

    }


    /*
      continuous overlap:
      next letter starts slightly before
      previous one finishes
    */

    tl.to(letter, {

      clipPath: "inset(0 0% 0 0)",

      duration: duration,

      ease: "none"

    }, index === 0 ? "-=0.03" : "-=0.045");

  });


  /* =========================================
     PARAGRAPH
  ========================================= */

  tl.to(".progress--bottom .max--718", {

    autoAlpha: 1,
    y: 0,

    duration: 0.42,

    ease: "power3.out"

  }, "-=0.05");


  /* =========================================
     IMAGE 1
  ========================================= */

  tl.to(".image-wrapper.is--progress1", {

    autoAlpha: 1,
    y: 0,

    duration: 0.5,

    ease: "expo.out"

  }, "-=0.05");


  tl.to(".image-wrapper.is--progress1 img", {

    scale: 1,

    duration: 0.82,

    ease: "power3.out"

  }, "<");


  /* =========================================
     IMAGE 2
  ========================================= */

  tl.to(".image-wrapper.is--progress2", {

    autoAlpha: 1,
    y: 0,

    duration: 0.5,

    ease: "expo.out"

  }, "-=0.36");


  tl.to(".image-wrapper.is--progress2 img", {

    scale: 1,

    duration: 0.82,

    ease: "power3.out"

  }, "<");


  /* =========================================
     STAMP
  ========================================= */

  tl.to(".stamp", {

    autoAlpha: 1,

    scale: 1,
    rotation: 0,

    duration: 0.55,

    ease: "back.out(1.2)"

  }, "-=0.3");

});