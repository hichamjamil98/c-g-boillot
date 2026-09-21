/* ==========================================
   HOME — GALERIE : NEXT / PREVIOUS SYNCHRONISÉS
   Distribution locale avec coin de feuille plié
   ========================================== */
   window.Webflow = window.Webflow || [];
   window.Webflow.push(() => {
     document.querySelectorAll('.is--home-gallery').forEach(section => {
       // A DOM property avoids treating copied data attributes as initialization.
       if (section.__homeCardsV4) return;
       const previous = section.querySelector('.slide--previous');
       const next = section.querySelector('.slider--next');
       const decks = ['.gallery--group1', '.gallery--group2'].map((selector, i) => {
         const group = section.querySelector(selector);
         const list = group?.querySelector('.w-dyn-items');
         return {
           side: i === 0 ? -1 : 1,
           index: 0,
           cards: list ? [...list.children].filter(el => el.matches('.w-dyn-item')) : []
         };
       }).filter(deck => deck.cards.length);
       if (!previous || !next || !decks.length) return;
       section.__homeCardsV4 = true;
       const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
       const wrap = (index, length) => (index % length + length) % length;
       let busy = false;
   
       const flat = {
         transform: 'perspective(1100px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
         boxShadow: '0px 0px 0px rgba(0,0,0,0)'
       };
       function pose(side, x, y, z, rx, ry, rz, shadow) {
         return {
           transform: `perspective(1100px) translate3d(${side * x}%, ${y}%, ${z}px) rotateX(${rx}deg) rotateY(${side * ry}deg) rotateZ(${side * rz}deg)`,
           boxShadow: `0px ${shadow}px ${shadow * 1.8}px rgba(0,0,0,${shadow ? 0.25 : 0})`
         };
       }
       function controls() {
         const disabled = busy || decks.every(deck => deck.cards.length < 2);
         [previous, next].forEach(button => button.setAttribute('aria-disabled', String(disabled)));
       }
       function render(deck) {
         deck.cards.forEach((card, i) => {
           const active = i === deck.index;
           Object.assign(card.style, flat, {
             opacity: '1',
             visibility: active ? 'visible' : 'hidden',
             zIndex: active ? '2' : '0',
             pointerEvents: active ? 'auto' : 'none',
             transformOrigin: '50% 85%',
             willChange: 'auto'
           });
           card.inert = !active;
           card.setAttribute('aria-hidden', String(!active));
         });
         // Preload both possible next images without loading the whole collection.
         [0, 1, -1].forEach(offset => {
           deck.cards[wrap(deck.index + offset, deck.cards.length)]
             .querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
         });
       }
       decks.forEach(deck => {
         deck.cards.forEach(card => {
           card.classList.add('home-card');
           if (!card.querySelector('.home-card-fold')) {
             const fold = document.createElement('span');
             fold.className = 'home-card-fold';
             fold.setAttribute('aria-hidden', 'true');
             card.appendChild(fold);
           }
         });
         render(deck);
       });
   
       async function move(direction) {
         if (busy || decks.every(deck => deck.cards.length < 2)) return;
         busy = true;
         controls();
         const animations = [];
         const changes = decks.filter(deck => deck.cards.length > 1).map(deck => ({
           deck,
           target: wrap(deck.index + direction, deck.cards.length)
         }));
         function animate(card, frames, duration) {
           const animation = card.animate(frames, {
             duration,
             easing: 'cubic-bezier(.25,.46,.45,.94)',
             fill: 'both'
           });
           animations.push(animation);
           return animation.finished;
         }
         try {
           if (!reducedMotion.matches) {
             const motions = [];
             changes.forEach(({ deck, target }) => {
               const current = deck.cards[deck.index];
               const incoming = deck.cards[target];
               const side = deck.side * direction;
               [current, incoming].forEach(card => {
                 card.style.visibility = 'visible';
                 card.style.pointerEvents = 'none';
                 card.style.willChange = 'transform, opacity';
                 card.style.transformOrigin = '50% 85%';
               });
               current.style.zIndex = '2';
               incoming.style.zIndex = '3';
   
               // Cut the image corner and reveal a shaded paper underside.
               // Both shapes use the same 14% corner and synchronized keyframes.
               const image = incoming.querySelector('.image--absolute100');
               const fold = incoming.querySelector('.home-card-fold');
               const corner = amount => `polygon(0% 0%, ${100 - amount}% 0%, 100% ${amount}%, 100% 100%, 0% 100%)`;
               if (image && fold) {
                 motions.push(animate(image, [
                   { clipPath: corner(0), offset: 0 },
                   { clipPath: corner(14), offset: 0.22 },
                   { clipPath: corner(7), offset: 0.55 },
                   { clipPath: corner(0), offset: 0.9 },
                   { clipPath: corner(0), offset: 1 }
                 ], 680));
                 motions.push(animate(fold, [
                   { transform: 'scale(0)', opacity: 0, offset: 0 },
                   { transform: 'scale(1)', opacity: 1, offset: 0.22 },
                   { transform: 'scale(.5)', opacity: 1, offset: 0.55 },
                   { transform: 'scale(0)', opacity: 0, offset: 0.9 },
                   { transform: 'scale(0)', opacity: 0, offset: 1 }
                 ], 680));
               }
   
               // Small fan movement; no departure outside the pile and no layer swap.
               motions.push(animate(current, [
                 { ...flat, offset: 0 },
                 { ...pose(-side, 3, 1, 0, 0, 0, 3, 3), offset: 0.45 },
                 { ...flat, offset: 1 }
               ], 680));
               motions.push(animate(incoming, [
                 { ...pose(side, 9, -3, 0, 2, -3, 8, 10), opacity: 0, offset: 0 },
                 { ...pose(side, 7, -2.5, 0, 2, -2, 6, 9), opacity: 1, offset: 0.22 },
                 { ...pose(side, 2, -0.5, 0, 0.5, -0.5, 1.5, 3), opacity: 1, offset: 0.7 },
                 { ...flat, opacity: 1, offset: 1 }
               ], 680));
             });
             await Promise.all(motions);
           }
         } catch (error) {
           // Commit a stable frame even if an animation is interrupted.
           if (error.name !== 'AbortError') console.warn('Home gallery:', error);
         } finally {
           changes.forEach(({ deck, target }) => { deck.index = target; });
           animations.forEach(animation => animation.cancel());
           decks.forEach(render);
           busy = false;
           controls();
         }
       }
       [
         [previous, -1, 'Image précédente'],
         [next, 1, 'Image suivante']
       ].forEach(([button, direction, label]) => {
         button.setAttribute('role', 'button');
         button.setAttribute('aria-label', label);
         button.addEventListener('click', event => {
           event.preventDefault();
           move(direction);
         });
         button.addEventListener('keydown', event => {
           if (event.key === ' ' && button.tagName !== 'BUTTON') {
             event.preventDefault();
             move(direction);
           }
         });
       });
       controls();
     });
   });
   