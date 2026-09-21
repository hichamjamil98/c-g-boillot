/* ==========================================
   HOME — GALERIE : NEXT / PREVIOUS SYNCHRONISÉS
   Animation de distribution de cartes
   ========================================== */

   window.Webflow = window.Webflow || [];

   window.Webflow.push(() => {
     document.querySelectorAll(".is--home-gallery").forEach(section => {
       if (section.dataset.cardsReady) return;
   
       const previous = section.querySelector(".slide--previous");
       const next = section.querySelector(".slider--next");
       const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
       const decks = [
         section.querySelector(".gallery--group1"),
         section.querySelector(".gallery--group2")
       ].map((group, index) => ({
         group,
         side: index === 0 ? -1 : 1,
         index: 0,
         cards: group
           ? [...group.querySelectorAll(".w-dyn-items > .w-dyn-item")]
           : []
       })).filter(deck => deck.cards.length);
   
       if (!decks.length || !previous || !next) return;
       section.dataset.cardsReady = "true";
       let busy = false;
   
       const wrap = (value, length) => ((value % length) + length) % length;
   
       // Appearance of the cards behind the active image.
       function pose(rank, side) {
         const depth = Math.min(rank, 2);
         return {
           transform: `translate3d(${side * depth * 7}px, ${depth * 7}px, 0)
             rotate(${side * depth * 4}deg) scale(${1 - depth * 0.035})`,
           opacity: rank < 3 ? 1 : 0
         };
       }
   
       function render(deck) {
         const count = deck.cards.length;
         deck.cards.forEach((card, index) => {
           const rank = wrap(index - deck.index, count);
           const state = pose(rank, deck.side);
           Object.assign(card.style, {
             transform: state.transform,
             opacity: String(state.opacity),
             zIndex: String(count - rank),
             pointerEvents: rank === 0 ? "auto" : "none"
           });
           card.setAttribute("aria-hidden", String(rank !== 0));
           card.inert = rank !== 0;
         });
       }
   
       function updateControls() {
         const disabled = busy || decks.every(deck => deck.cards.length < 2);
         [previous, next].forEach(button => {
           button.setAttribute("aria-disabled", String(disabled));
         });
       }
   
       decks.forEach(deck => {
         deck.cards.forEach((card, index) => {
           if (index < 3 || index === deck.cards.length - 1) {
             card.querySelectorAll("img").forEach(image => {
               image.loading = "eager";
             });
           }
         });
         render(deck);
       });
   
       async function move(direction) {
         if (busy || decks.every(deck => deck.cards.length < 2)) return;
         busy = true;
         updateControls();
   
         const animations = [];
         const duration = reducedMotion.matches ? 0 : 780;
         try {
           decks.forEach(deck => {
             const count = deck.cards.length;
             if (count < 2) return;
             const oldIndex = deck.index;
             const targetIndex = wrap(oldIndex + direction, count);
             const travel = deck.side * direction;
   
             deck.cards[targetIndex].querySelectorAll("img").forEach(image => {
               image.loading = "eager";
             });
   
             deck.cards.forEach((card, index) => {
               const oldRank = wrap(index - oldIndex, count);
               const newRank = wrap(index - targetIndex, count);
               const from = pose(oldRank, deck.side);
               const to = pose(newRank, deck.side);
               const incoming = index === targetIndex;
               const outgoing = index === oldIndex;
   
               card.style.pointerEvents = "none";
               card.style.zIndex = String(
                 incoming ? count + 2 : outgoing ? count + 1 : count - newRank
               );
   
               const frames = incoming ? [
                 {
                   transform: `translate3d(${travel * 85}%, -18%, 0)
                     rotate(${travel * 23}deg) scale(1.04)`,
                   opacity: 0,
                   offset: 0
                 },
                 {
                   transform: `translate3d(${travel * 52}%, -12%, 0)
                     rotate(${travel * 15}deg) scale(1.03)`,
                   opacity: 1,
                   offset: 0.18
                 },
                 { ...to, offset: 1 }
               ] : [from, to];
   
               animations.push(card.animate(frames, {
                 duration,
                 easing: "cubic-bezier(.22,.61,.36,1)",
                 fill: "both"
               }));
             });
             deck.index = targetIndex;
           });
           await Promise.allSettled(animations.map(animation => animation.finished));
         } finally {
           decks.forEach(render);
           animations.forEach(animation => animation.cancel());
           busy = false;
           updateControls();
         }
       }
   
       [
         [previous, -1, "Image précédente"],
         [next, 1, "Image suivante"]
       ].forEach(([button, direction, label]) => {
         button.setAttribute("role", "button");
         button.setAttribute("aria-label", label);
         button.addEventListener("click", event => {
           event.preventDefault();
           move(direction);
         });
         button.addEventListener("keydown", event => {
           if (event.key === " ") {
             event.preventDefault();
             move(direction);
           }
         });
       });
       updateControls();
     });
   });
   