window.addEventListener("DOMContentLoaded", () => {

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });

  /*
  --------------------------------
  INITIAL STATES
  --------------------------------
  */

  gsap.set(".main-wrapper", {
    autoAlpha: 1
  });

  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 16
  });

  gsap.set(".heading--80", {
    autoAlpha: 0,
    yPercent: 110
  });

  gsap.set(".heading--sub120", {
    autoAlpha: 1,
    y: 20,
    clipPath: "inset(0 100% 0 0)"
  });

  gsap.set(".progress--bottom .max--718", {
    autoAlpha: 0,
    y: 20
  });

  gsap.set(".image-wrapper.is--progress1", {
    autoAlpha: 0,
    y: 45
  });

  gsap.set(".image-wrapper.is--progress2", {
    autoAlpha: 0,
    y: 45
  });

  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.65,
    rotation: -20
  });


  /*
  --------------------------------
  TIMELINE
  --------------------------------
  */

  tl

  // tag
  .to(".title--tag", {
    autoAlpha: 1,
    y: 0,
    duration: 0.7
  })

  // main heading
  .to(".heading--80", {
    autoAlpha: 1,
    yPercent: 0,
    duration: 1.05,
    ease: "expo.out"
  }, "-=0.3")

  // "Arrive bientôt" dessin / reveal
  .to(".heading--sub120", {
    clipPath: "inset(0 0% 0 0)",
    y: 0,
    duration: 1.5,
    ease: "expo.inOut"
  }, "-=0.6")

  // description
  .to(".progress--bottom .max--718", {
    autoAlpha: 1,
    y: 0,
    duration: 0.8
  }, "-=0.65")

  // image 1
  .to(".image-wrapper.is--progress1", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "expo.out"
  }, "-=0.25")

  .to(".image-wrapper.is--progress1 img", {
    scale: 1,
    duration: 1.6,
    ease: "power3.out"
  }, "<")

  // image 2
  .to(".image-wrapper.is--progress2", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "expo.out"
  }, "-=0.8")

  .to(".image-wrapper.is--progress2 img", {
    scale: 1,
    duration: 1.6,
    ease: "power3.out"
  }, "<")

  // stamp final
  .to(".stamp", {
    autoAlpha: 1,
    scale: 1,
    rotation: 0,
    duration: 1.15,
    ease: "back.out(1.7)"
  }, "-=0.7");

});