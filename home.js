/* ==========================================
   HOME — GALERIE : DISTRIBUTION DE CARTES FLUIDE
   Next et Previous : même animation, deux collections synchronisées.
   ========================================== */
   window.Webflow = window.Webflow || [];
   window.Webflow.push(() => {
     document.querySelectorAll('.is--home-gallery').forEach(section => {
       if (section.__homeDeal) return;
       const previous = section.querySelector('.slide--previous');
       const next = section.querySelector('.slider--next');
       const decks = ['.gallery--group1', '.gallery--group2'].map(selector => {
         const list = section.querySelector(selector)?.querySelector('.w-dyn-items');
         return { list, index: 0, cards: list ? [...list.children].filter(el => el.matches('.w-dyn-item')) : [] };
       }).filter(deck => deck.cards.length);
       if (!decks.length || !previous || !next) return;
       section.__homeDeal = true;
       const DURATION = 550;
       const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
       const wrap = (n, length) => (n % length + length) % length;
       let busy = false;
   
       function controls() {
         const disabled = busy || decks.every(deck => deck.cards.length < 2);
         [previous, next].forEach(button => button.setAttribute('aria-disabled', String(disabled)));
       }
       function render(deck) {
         deck.cards.forEach((card, i) => {
           const active = i === deck.index;
           Object.assign(card.style, {
             transform: 'none', boxShadow: 'none', opacity: '1',
             visibility: active ? 'visible' : 'hidden', zIndex: active ? '2' : '0',
             pointerEvents: active ? 'auto' : 'none', willChange: 'auto'
           });
           card.inert = !active;
           card.setAttribute('aria-hidden', String(!active));
         });
         [0, 1, -1].forEach(offset => {
           deck.cards[wrap(deck.index + offset, deck.cards.length)].querySelectorAll('img')
             .forEach(img => { img.loading = 'eager'; });
         });
       }
       decks.forEach(deck => {
         deck.cards.forEach(card => {
           card.classList.add('home-card');
           card.querySelectorAll('.home-card-fold').forEach(fold => fold.remove());
         });
         render(deck);
       });
   
       async function move(direction) {
         if (busy || decks.every(deck => deck.cards.length < 2)) return;
         busy = true;
         controls();
         const changes = decks.filter(deck => deck.cards.length > 1)
           .map(deck => ({ deck, target: wrap(deck.index + direction, deck.cards.length) }));
         const animations = [];
         try {
           const images = changes.map(({ deck, target }) => deck.cards[target].querySelector('img'));
           // Avoid unfolding an empty image on a slow connection; timeout keeps controls usable.
           await Promise.all(images.filter(Boolean).map(image => {
             image.loading = 'eager';
             if (!image.decode) return Promise.resolve();
             return new Promise(resolve => {
               const timeout = setTimeout(resolve, 2500);
               image.decode().catch(() => {}).finally(() => { clearTimeout(timeout); resolve(); });
             });
           }));
           if (!reduced.matches) {
             changes.forEach(({ deck, target }, index) => {
               const incoming = deck.cards[target];
               const side = index % 2 === 0 ? -1 : 1;
               incoming.style.visibility = 'visible';
               incoming.style.zIndex = '3';
               incoming.style.pointerEvents = 'none';
               incoming.style.transformOrigin = '50% 85%';
               incoming.style.willChange = 'transform, opacity';
               const transform = (x, y, angle) =>
                 `translate3d(${side * x}%, ${y}%, 0) rotate(${side * angle}deg)`;
               // One intact card, dealt from just above the pile in both directions.
               animations.push(incoming.animate([
                 { transform: transform(3, -13, 5), opacity: 0,
                   boxShadow: '0 14px 24px rgba(0,0,0,.16)', offset: 0 },
                 { transform: transform(2.4, -10, 4), opacity: 1,
                   boxShadow: '0 11px 20px rgba(0,0,0,.13)', offset: 0.16 },
                 { transform: transform(0, 0, 0), opacity: 1,
                   boxShadow: '0 0px 0px rgba(0,0,0,0)', offset: 1 }
               ], {
                 duration: DURATION,
                 easing: 'cubic-bezier(.22,.61,.36,1)',
                 fill: 'both'
               }));
             });
             await Promise.all(animations.map(animation => animation.finished));
           }
         } catch (error) {
           console.warn('Home gallery:', error);
         } finally {
           changes.forEach(({ deck, target }) => { deck.index = target; });
           decks.forEach(render);
           animations.forEach(animation => animation.cancel());
           busy = false;
           controls();
         }
       }
       [[previous, -1, 'Image précédente'], [next, 1, 'Image suivante']].forEach(([button, direction, label]) => {
         button.setAttribute('role', 'button');
         button.setAttribute('aria-label', label);
         button.addEventListener('click', event => { event.preventDefault(); move(direction); });
         button.addEventListener('keydown', event => {
           if (event.key === ' ' && button.tagName !== 'BUTTON') { event.preventDefault(); move(direction); }
         });
       });
       controls();
     });
   });
   