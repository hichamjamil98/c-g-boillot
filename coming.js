window.addEventListener("load", () => {

  const subTitle = document.querySelector(".sub--title");
  const subTitlePath = document.querySelector(".sub--title path");

  if (!subTitle || !subTitlePath) return;


  /* =========================================
     INITIAL STATES
  ========================================= */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });


  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 12
  });


  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 28
  });


  /*
    SVG caché de droite vers gauche
  */

  gsap.set(subTitlePath, {
    clipPath: "inset(0 100% 0 0)",
    opacity: 1
  });


  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 20
  });


  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 30
  });


  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 30
  });


  gsap.set(".image-wrapper.is--progress1 img", {
    scale: 1.08
  });


  gsap.set(".image-wrapper.is--progress2 img", {
    scale: 1.08
  });


  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.82,
    rotation: -8
  });



  /* =========================================
     TIMELINE
  ========================================= */

  const tl = gsap.timeline({
    delay: 0.08
  });



  /* =========================================
     TAG
  ========================================= */

  tl.to(".title--tag", {
    autoAlpha: 1,
    y: 0,

    duration: 0.42,

    ease: "power3.out"
  });



  /* =========================================
     MAIN HEADING
  ========================================= */

  tl.to(".heading--80", {
    autoAlpha: 1,
    y: 0,

    duration: 0.62,

    ease: "expo.out"
  }, "-=0.18");



  /* =========================================
     SVG WRITING / REVEAL
  ========================================= */

  tl.to(subTitlePath, {
    clipPath: "inset(0 0% 0 0)",

    duration: 1.25,

    ease: "power2.inOut"
  }, "-=0.12");



  /* =========================================
     PARAGRAPH
  ========================================= */

  tl.to(".progress--bottom .max--718", {
    autoAlpha: 1,
    y: 0,

    duration: 0.55,

    ease: "power3.out"
  }, "-=0.2");



  /* =========================================
     IMAGE 1
  ========================================= */

  tl.to(".image-wrapper.is--progress1", {
    autoAlpha: 1,
    y: 0,

    duration: 0.65,

    ease: "expo.out"
  }, "-=0.12");


  tl.to(".image-wrapper.is--progress1 img", {
    scale: 1,

    duration: 1.05,

    ease: "power3.out"
  }, "<");



  /* =========================================
     IMAGE 2
  ========================================= */

  tl.to(".image-wrapper.is--progress2", {
    autoAlpha: 1,
    y: 0,

    duration: 0.65,

    ease: "expo.out"
  }, "-=0.48");


  tl.to(".image-wrapper.is--progress2 img", {
    scale: 1,

    duration: 1.05,

    ease: "power3.out"
  }, "<");



  /* =========================================
     STAMP
  ========================================= */

  tl.to(".stamp", {
    autoAlpha: 1,

    scale: 1,
    rotation: 0,

    duration: 0.72,

    ease: "back.out(1.3)"
  }, "-=0.4");

});