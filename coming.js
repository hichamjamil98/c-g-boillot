window.addEventListener("load", () => {

  /* =========================================
     ELEMENTS
  ========================================== */

  const svgText = document.querySelector(".subheading-write-text");
  const originalHeading = document.querySelector(".heading--sub120");

  if (!svgText || !originalHeading) return;


  /* =========================================
     GET SUBHEADING COLOR
  ========================================== */

  const color = getComputedStyle(originalHeading).color;

  svgText.style.color = color;


  /* =========================================
     SVG WRITING SETUP
  ========================================== */

  let textLength;

  try {
    textLength = svgText.getComputedTextLength();
  } catch (e) {
    textLength = 1000;
  }

  const dashLength = textLength * 3;

  gsap.set(svgText, {
    strokeDasharray: `${dashLength} ${dashLength}`,
    strokeDashoffset: dashLength,
    stroke: color,
    strokeOpacity: 1,
    fill: "transparent",
    opacity: 1
  });


  /* =========================================
     INITIAL STATES
  ========================================== */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });

  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 18
  });

  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 45
  });

  gsap.set(".subheading-write-wrapper", {
    autoAlpha: 1
  });

  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 30
  });

  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 55
  });

  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 55
  });

  gsap.set(".image-wrapper.is--progress1 img", {
    scale: 1.14
  });

  gsap.set(".image-wrapper.is--progress2 img", {
    scale: 1.14
  });

  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.7,
    rotation: -15
  });


  /* =========================================
     TIMELINE
  ========================================== */

  const tl = gsap.timeline({
    delay: 0.2,
    defaults: {
      ease: "power3.out"
    }
  });


  /* =========================================
     TAG
  ========================================== */

  tl.to(".title--tag", {
    autoAlpha: 1,
    y: 0,
    duration: 0.7
  });


  /* =========================================
     HEADING
  ========================================== */

  tl.to(".heading--80", {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: "expo.out"
  }, "-=0.3");


  /* =========================================
     SUBHEADING WRITING
  ========================================== */

  tl.to(svgText, {
    strokeDashoffset: 0,
    duration: 3.1,
    ease: "power1.inOut"
  }, "-=0.1");


  /* =========================================
     FILL SUBHEADING
  ========================================== */

  tl.to(svgText, {
    fill: color,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.7");


  /* =========================================
     REMOVE OUTLINE
  ========================================== */

  tl.to(svgText, {
    strokeOpacity: 0,
    duration: 0.45,
    ease: "power2.out"
  }, "-=0.35");


  /* =========================================
     PARAGRAPH
  ========================================== */

  tl.to(".progress--bottom .max--718", {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out"
  }, "-=0.1");


  /* =========================================
     IMAGE 1
  ========================================== */

  tl.to(".image-wrapper.is--progress1", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "expo.out"
  }, "-=0.2");

  tl.to(".image-wrapper.is--progress1 img", {
    scale: 1,
    duration: 1.8,
    ease: "power3.out"
  }, "<");


  /* =========================================
     IMAGE 2
  ========================================== */

  tl.to(".image-wrapper.is--progress2", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "expo.out"
  }, "-=0.8");

  tl.to(".image-wrapper.is--progress2 img", {
    scale: 1,
    duration: 1.8,
    ease: "power3.out"
  }, "<");


  /* =========================================
     STAMP
  ========================================== */

  tl.to(".stamp", {
    autoAlpha: 1,
    scale: 1,
    rotation: 0,
    duration: 1.15,
    ease: "back.out(1.5)"
  }, "-=0.65");

});