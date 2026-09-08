window.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SUBHEADING SPLIT
  ========================= */

  const subheading = document.querySelector(".heading--sub120");

  if (subheading) {
    const originalText = subheading.textContent.trim();

    subheading.innerHTML = originalText
      .split("")
      .map(char => {

        if (char === " ") {
          return '<span class="char char-space">&nbsp;</span>';
        }

        return `<span class="char">${char}</span>`;
      })
      .join("");
  }


  /* =========================
     ELEMENTS
  ========================= */

  const chars = document.querySelectorAll(".heading--sub120 .char");

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });


  /* =========================
     INITIAL STATES
  ========================= */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });

  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 14
  });

  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 35
  });

  gsap.set(chars, {
    autoAlpha: 0,
    y: "0.35em",
    filter: "blur(5px)"
  });

  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 25
  });

  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 55
  });

  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 55
  });

  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.65,
    rotation: -15
  });


  /* =========================
     TIMELINE
  ========================= */

  tl

  /* Tag */
  .to(".title--tag", {
    autoAlpha: 1,
    y: 0,
    duration: 0.7
  })

  /* Heading principal */
  .to(".heading--80", {
    autoAlpha: 1,
    y: 0,
    duration: 1.05,
    ease: "expo.out"
  }, "-=0.25")

  /* Subheading qui s'écrit */
  .to(chars, {
    autoAlpha: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.65,
    stagger: {
      each: 0.055,
      ease: "none"
    },
    ease: "power3.out"
  }, "-=0.35")

  /* Paragraph */
  .to(".progress--bottom .max--718", {
    autoAlpha: 1,
    y: 0,
    duration: 0.9
  }, "-=0.25")

  /* Première image */
  .to(".image-wrapper.is--progress1", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "expo.out"
  }, "-=0.15")

  .to(".image-wrapper.is--progress1 img", {
    scale: 1,
    duration: 1.8,
    ease: "power3.out"
  }, "<")

  /* Deuxième image */
  .to(".image-wrapper.is--progress2", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "expo.out"
  }, "-=0.75")

  .to(".image-wrapper.is--progress2 img", {
    scale: 1,
    duration: 1.8,
    ease: "power3.out"
  }, "<")

  /* Stamp */
  .to(".stamp", {
    autoAlpha: 1,
    scale: 1,
    rotation: 0,
    duration: 1.15,
    ease: "back.out(1.5)"
  }, "-=0.7");

});