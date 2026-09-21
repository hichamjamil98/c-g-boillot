/* ==========================================
   HOME — GALERIE : NEXT / PREVIOUS SYNCHRONISÉS
   Cartes superposées, soulèvement et mélange 3D
   ========================================== */
   window.Webflow = window.Webflow || [];
   window.Webflow.push(() => {
     document.querySelectorAll('.is--home-gallery').forEach(section => {
       // A DOM property avoids treating copied data attributes as initialization.
       if (section.__homeCardsV2) return;
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
       section.__homeCardsV2 = true;
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
             transformOrigin: '50% 75%',
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
         deck.cards.forEach(card => card.classList.add('home-card'));
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
             easing: 'cubic-bezier(.4,0,.2,1)',
             fill: 'both'
           });
           animations.push(animation);
           return animation.finished;
         }
         try {
           if (!reducedMotion.matches) {
             changes.forEach(change => {
               const { deck, target } = change;
               const current = deck.cards[deck.index];
               const incoming = deck.cards[target];
               change.moving = direction === 1 ? current : incoming;
               change.still = direction === 1 ? incoming : current;
               change.side = deck.side * direction;
               [current, incoming].forEach(card => {
                 card.style.visibility = 'visible';
                 card.style.pointerEvents = 'none';
               });
               change.moving.style.zIndex = direction === 1 ? '3' : '1';
               change.still.style.zIndex = '2';
               change.moving.style.willChange = 'transform, box-shadow';
               change.moving.style.transformOrigin = `${change.side < 0 ? 85 : 15}% 80%`;
               change.lift = pose(change.side, 9, -5, 65, 11, -19, 7, 20);
               change.out = pose(change.side, 125, -14, 100, 8, -24, 19, 32);
             });
             // Both collections lift and slide at precisely the same time.
             await Promise.all(changes.map(change => animate(change.moving, [
               { ...flat, offset: 0 },
               { ...change.lift, offset: 0.32 },
               { ...change.out, offset: 1 }
             ], 480)));
   
             // Switch layer order only once the moving card clears the pile.
             changes.forEach(change => {
               change.moving.style.zIndex = direction === 1 ? '1' : '3';
             });
             await Promise.all(changes.map(change => animate(change.moving, [
               { ...change.out, offset: 0 },
               { ...pose(change.side, 35, -5, 55, -5, 13, 8, 18), offset: 0.52 },
               { ...pose(change.side, 0, 0, 8, -3, 3, -1, 4), offset: 0.87 },
               { ...flat, offset: 1 }
             ], 570)));
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
   