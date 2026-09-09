window.addEventListener("load", () => {

  const maskPath = document.querySelector(".subheading-mask-path");
  const svgText = document.querySelector(".subheading-write-text");
  const originalSubheading = document.querySelector(".heading--sub120");

  if (!maskPath || !svgText || !originalSubheading) return;


  /* =========================
     SUBHEADING COLOR
  ========================= */

  const subheadingColor = getComputedStyle(originalSubheading).color;

  svgText.style.color = subheadingColor;


  /* =========================
     MASK PATH SETUP
  ========================= */

  const pathLength = maskPath.getTotalLength();

  gsap.set(maskPath, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  });


  /* =========================
     INITIAL STATES
  ========================= */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });

  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 16
  });

  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 35
  });

  gsap.set(".subheading-write-wrapper", {
    autoAlpha: 1
  });

  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 25
  });

  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 45
  });

  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 45
  });

  gsap.set(".image-wrapper.is--progress1 img", {
    scale: 1.14
  });

  gsap.set(".image-wrapper.is--progress2 img", {
    scale: 1.14
  });

  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.72,
    rotation: -12
  });


  /* =========================
     TIMELINE
  ========================= */

  const tl = gsap.timeline({
    delay: 0.15
  });


  /* TAG */

  tl.to(".title--tag", {
    autoAlpha: 1,
    y: 0,
    duration: 0.65,
    ease: "power3.out"
  });


  /* MAIN HEADING */

  tl.to(".heading--80", {
    autoAlpha: 1,
    y: 0,
    duration: 0.95,
    ease: "expo.out"
  }, "-=0.3");


  /* SUBHEADING WRITING */

  tl.to(maskPath, {
    strokeDashoffset: 0,
    duration: 2.4,
    ease: "power1.inOut"
  }, "-=0.1");


  /* PARAGRAPH */

  tl.to(".progress--bottom .max--718", {
    autoAlpha: 1,
    y: 0,
    duration: 0.85,
    ease: "power3.out"
  }, "-=0.2");


  /* IMAGE 1 */

  tl.to(".image-wrapper.is--progress1", {
    autoAlpha: 1,
    y: 0,
    duration: 1.05,
    ease: "expo.out"
  }, "-=0.1");

  tl.to(".image-wrapper.is--progress1 img", {
    scale: 1,
    duration: 1.7,
    ease: "power3.out"
  }, "<");


  /* IMAGE 2 */

  tl.to(".image-wrapper.is--progress2", {
    autoAlpha: 1,
    y: 0,
    duration: 1.05,
    ease: "expo.out"
  }, "-=0.75");

  tl.to(".image-wrapper.is--progress2 img", {
    scale: 1,
    duration: 1.7,
    ease: "power3.out"
  }, "<");


  /* STAMP */

  tl.to(".stamp", {
    autoAlpha: 1,
    scale: 1,
    rotation: 0,
    duration: 1.1,
    ease: "back.out(1.4)"
  }, "-=0.6");

});