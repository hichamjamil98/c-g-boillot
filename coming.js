window.addEventListener("load", () => {

  const subheading = document.querySelector(".heading--sub120");

  if (!subheading) return;

  /* =========================
     BUILD SVG MASK
  ========================= */

  const text = subheading.textContent.trim();

  const computed = getComputedStyle(subheading);

  const fontFamily = computed.fontFamily;
  const fontSize = parseFloat(computed.fontSize);
  const fontWeight = computed.fontWeight;

  const width = subheading.offsetWidth;
  const height = subheading.offsetHeight;

  const wrapper = document.createElement("div");

  wrapper.className = "subheading-write-wrapper";

  wrapper.style.width = width + "px";
  wrapper.style.height = height + "px";

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.setAttribute("class", "subheading-write-svg");

  svg.setAttribute(
    "viewBox",
    `0 0 ${width} ${height}`
  );

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);


  /* =========================
     TEXT
  ========================= */

  const svgText = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );

  svgText.textContent = text;

  svgText.setAttribute("x", "0");

  svgText.setAttribute(
    "y",
    height * 0.82
  );

  svgText.setAttribute(
    "fill",
    computed.color
  );

  svgText.style.fontFamily = fontFamily;
  svgText.style.fontSize = fontSize + "px";
  svgText.style.fontWeight = fontWeight;


  /* =========================
     MASK
  ========================= */

  const defs = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "defs"
  );

  const mask = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "mask"
  );

  mask.setAttribute(
    "id",
    "subheading-write-mask"
  );


  const maskPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  /*
  This path crosses the full text
  like a handwriting stroke.
  */

  const y = height * 0.55;

  maskPath.setAttribute(
    "d",
    `
      M 0 ${y}
      C ${width * 0.15} ${height * 0.2},
        ${width * 0.25} ${height * 0.9},
        ${width * 0.4} ${y}

      S ${width * 0.7} ${height * 0.2},
        ${width * 0.82} ${y}

      S ${width * 0.95} ${height * 0.8},
        ${width} ${y}
    `
  );

  maskPath.setAttribute("fill", "none");

  maskPath.setAttribute(
    "stroke",
    "white"
  );

  maskPath.setAttribute(
    "stroke-width",
    height * 1.4
  );

  maskPath.setAttribute(
    "stroke-linecap",
    "round"
  );


  mask.appendChild(maskPath);

  defs.appendChild(mask);

  svg.appendChild(defs);


  /* apply mask */

  svgText.setAttribute(
    "mask",
    "url(#subheading-write-mask)"
  );

  svg.appendChild(svgText);

  wrapper.appendChild(svg);


  /* =========================
     REPLACE VISUALLY
  ========================= */

  subheading.style.opacity = "0";

  subheading.style.position = "absolute";

  subheading.parentNode.insertBefore(
    wrapper,
    subheading.nextSibling
  );


  /* =========================
     PATH LENGTH
  ========================= */

  const pathLength =
    maskPath.getTotalLength();

  gsap.set(maskPath, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  });


  /* =========================
     OTHER INITIAL STATES
  ========================= */

  gsap.set(".title--tag", {
    autoAlpha: 0,
    y: 18
  });

  gsap.set(".heading--80", {
    autoAlpha: 0,
    y: 45
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
      y: 60
    }
  );

  gsap.set(
    ".image-wrapper.is--progress2",
    {
      autoAlpha: 0,
      y: 60
    }
  );

  gsap.set(
    ".image-wrapper.is--progress1 img",
    {
      scale: 1.15
    }
  );

  gsap.set(
    ".image-wrapper.is--progress2 img",
    {
      scale: 1.15
    }
  );

  gsap.set(".stamp", {
    autoAlpha: 0,
    scale: 0.7,
    rotation: -15
  });


  /* =========================
     TIMELINE
  ========================= */

  const tl = gsap.timeline();


  tl.to(".title--tag", {
    autoAlpha: 1,
    y: 0,
    duration: 0.7,
    ease: "power3.out"
  });


  tl.to(".heading--80", {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: "expo.out"
  }, "-=0.3");


  /*
  REAL WRITING REVEAL
  */

  tl.to(maskPath, {
    strokeDashoffset: 0,
    duration: 2.4,
    ease: "power1.inOut"
  }, "-=0.2");


  tl.to(
    ".progress--bottom .max--718",
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out"
    },
    "-=0.4"
  );


  /* IMAGE 1 */

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


  /* IMAGE 2 */

  tl.to(
    ".image-wrapper.is--progress2",
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out"
    },
    "-=0.75"
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


  /* STAMP */

  tl.to(".stamp", {
    autoAlpha: 1,
    scale: 1,
    rotation: 0,
    duration: 1.1,
    ease: "back.out(1.5)"
  }, "-=0.6");

});