/* ==========================================
   HOME — GALERIE : DISTRIBUTION DE CARTES — PILE ET INCLINAISONS CONSERVÉES
   Next et Previous : même animation, deux collections synchronisées.
   ========================================== */
   window.Webflow = window.Webflow || [];
   window.Webflow.push(() => {
     document.querySelectorAll('.is--home-gallery').forEach(section => {
       if (section.__homeDealStack) return;
       const previous = section.querySelector('.slide--previous');
       const next = section.querySelector('.slider--next');
       const decks = ['.gallery--group1', '.gallery--group2'].map(selector => {
         const list = section.querySelector(selector)?.querySelector('.w-dyn-items');
         return { list, index: 0, cards: list ? [...list.children].filter(el => el.matches('.w-dyn-item')) : [] };
       }).filter(deck => deck.cards.length);
       if (!decks.length || !previous || !next) return;
       section.__homeDealStack = true;
       const DURATION = 1100;
       const MAX_TILT = 3.5; // Inclinaison finale maximale, en degrés.
       const random = (min, max) => min + Math.random() * (max - min);
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
             transform: `translate3d(0, 0, 0) rotate(${card.__dealAngle || 0}deg)`,
             transformOrigin: '50% 50%', boxShadow: 'none', opacity: '1',
             visibility: 'visible', zIndex: String(deck.order.indexOf(card) + 1),
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
         // Bottom to top: keep every dealt card and its saved angle in the pile.
         deck.order = [...deck.cards].reverse();
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
           .map(deck => {
             const currentAngle = deck.cards[deck.index].__dealAngle || 0;
             let angle = random(-MAX_TILT, MAX_TILT);
             // Make each new inclination perceptible without accumulating rotation.
             if (Math.abs(angle - currentAngle) < 1.2) {
               angle = currentAngle >= 0 ? random(-MAX_TILT, -1.2) : random(1.2, MAX_TILT);
             }
             return { deck, target: wrap(deck.index + direction, deck.cards.length), angle };
           });
         const animations = [];
         try {
           const images = changes.map(({ deck, target }) => deck.cards[target].querySelector('img'));
           // Avoid dealing an empty image on a slow connection; timeout keeps controls usable.
           await Promise.all(images.filter(Boolean).map(image => {
             image.loading = 'eager';
             if (!image.decode) return Promise.resolve();
             return new Promise(resolve => {
               const timeout = setTimeout(resolve, 2500);
               image.decode().catch(() => {}).finally(() => { clearTimeout(timeout); resolve(); });
             });
           }));
           if (!reduced.matches) {
             changes.forEach(({ deck, target, angle }) => {
               const incoming = deck.cards[target];
               const side = Math.random() < .5 ? -1 : 1;
               const x = side * random(2, 5);
               const y = -random(11, 16);
               const startAngle = angle + side * random(4, 7);
               incoming.style.visibility = 'visible';
               incoming.style.zIndex = String(deck.cards.length + 1);
               incoming.style.pointerEvents = 'none';
               incoming.style.transformOrigin = '50% 50%';
               incoming.style.willChange = 'transform, opacity';
               const transform = (x, y, rotation) =>
                 `translate3d(${x}%, ${y}%, 0) rotate(${rotation}deg)`;
               // Same top-down deal for Next and Previous, with a fresh bounded angle.
               // A continuous ease-out avoids pauses between intermediate poses.
               animations.push(incoming.animate([
                 { transform: transform(x, y, startAngle),
                   boxShadow: '0 14px 25px rgba(0,0,0,.16)' },
                 { transform: transform(0, 0, angle),
                   boxShadow: '0 0px 0px rgba(0,0,0,0)' }
               ], {
                 duration: DURATION,
                 easing: 'cubic-bezier(.25,.46,.35,1)',
                 fill: 'both'
               }));
               animations.push(incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
                 duration: 180, easing: 'ease-out', fill: 'both'
               }));
             });
             await Promise.all(animations.map(animation => animation.finished));
           }
         } catch (error) {
           console.warn('Home gallery:', error);
         } finally {
           changes.forEach(({ deck, target, angle }) => {
             const card = deck.cards[target];
             card.__dealAngle = angle;
             deck.order = deck.order.filter(item => item !== card);
             deck.order.push(card);
             deck.index = target;
           });
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
   
   /* ==========================================
      HOME — CURSOR : SUIVI FLUIDE AU SURVOL
      Reprise du comportement du curseur projet fourni, sans dépendance GSAP.
      Cibles : les deux images de Nos vins dans .grid--2cl.is--home.
      ========================================== */
   window.Webflow.push(() => {
     const cursor = document.querySelector('.cursor');
     if (!cursor || cursor.__homeCursorReady) return;
     cursor.__homeCursorReady = true;
     const targets = '.grid--2cl.is--home > .image-wrapper';
     const desktop = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
     const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
     cursor.classList.add('home-cursor');
     cursor.closest('.cursor-parent')?.classList.add('home-cursor-parent');
     cursor.setAttribute('aria-hidden', 'true');
     let x = 0, y = 0, targetX = 0, targetY = 0;
     let active = false, positioned = false, frame = 0, lastTime = 0;
   
     function position() {
       cursor.style.setProperty('--cursor-x', `${x}px`);
       cursor.style.setProperty('--cursor-y', `${y}px`);
     }
     function tick(time) {
       frame = 0;
       const dt = lastTime ? Math.min(time - lastTime, 64) : 16.67;
       lastTime = time;
       // Same 0.18 follow factor as the reference, adjusted for refresh rate.
       const factor = reduced.matches ? 1 : 1 - Math.pow(1 - .18, dt / 16.67);
       x += (targetX - x) * factor;
       y += (targetY - y) * factor;
       const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < .1;
       if (settled) { x = targetX; y = targetY; }
       position();
       if (active && !settled) frame = requestAnimationFrame(tick);
     }
     function hide() {
       active = false;
       cursor.classList.remove('is-visible');
       if (frame) cancelAnimationFrame(frame);
       frame = 0;
       lastTime = 0;
     }
     function update(element) {
       const overTarget = element instanceof Element && element.closest(targets);
       if (!desktop.matches || !overTarget) { hide(); return; }
       if (!active) {
         x = targetX; y = targetY;
         position();
         active = true;
         cursor.classList.add('is-visible');
       }
       if (!frame) { lastTime = 0; frame = requestAnimationFrame(tick); }
     }
     document.addEventListener('pointermove', event => {
       if (event.pointerType === 'touch') { hide(); return; }
       targetX = event.clientX; targetY = event.clientY;
       positioned = true;
       update(event.target);
     }, { passive: true });
     document.addEventListener('pointerout', event => {
       if (!event.relatedTarget) hide();
       else if (positioned) update(event.relatedTarget);
     });
     window.addEventListener('blur', hide);
     document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
     // Re-evaluate hover when the page moves under a stationary pointer.
     function refresh() {
       if (positioned) update(document.elementFromPoint(targetX, targetY));
       else hide();
     }
     document.addEventListener('scroll', refresh, { passive: true, capture: true });
     desktop.addEventListener('change', refresh);
     window.addEventListener('resize', refresh, { passive: true });
   });
   
   /* ==========================================
      HOME — NOS VINS : AGRANDISSEMENT AU SURVOL
      L'image survolée s'élargit, sa voisine se resserre.
      ========================================== */
   window.Webflow.push(() => {
     const desktop = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
     document.querySelectorAll('.grid--2cl.is--home').forEach(grid => {
       if (grid.__wineHoverReady) return;
       const items = [...grid.children].filter(item => item.matches('.image-wrapper'));
       if (items.length !== 2) return;
       grid.__wineHoverReady = true;
       let hovered = -1;
       let focused = -1;
       function update() {
         const index = desktop.matches ? (hovered >= 0 ? hovered : focused) : -1;
         grid.classList.toggle('is-wine-first', index === 0);
         grid.classList.toggle('is-wine-second', index === 1);
         items.forEach((item, i) => {
           item.classList.toggle('is--hovered', index === i);
           item.classList.toggle('is--neighbor-squeeze', index >= 0 && index !== i);
         });
       }
       function setup() {
         hovered = focused = -1;
         grid.classList.remove('home-wine-hover', 'is-wine-first', 'is-wine-second');
         if (desktop.matches) {
           // Capture each original Webflow height before changing column widths.
           // This also preserves different heights and percentage/aspect-ratio sizing.
           items.forEach(item => {
             item.style.setProperty('--wine-item-height', `${getComputedStyle(item).height}`);
           });
           // Preserve the original column proportions before enabling the hover.
           const first = items[0].getBoundingClientRect().width;
           const second = items[1].getBoundingClientRect().width;
           const ratio = first + second ? first / (first + second) : .5;
           const firstHover = Math.min(.8, ratio + .09);
           const secondHover = Math.max(.2, ratio - .09);
           const pairs = { base: ratio, first: firstHover, second: secondHover };
           Object.entries(pairs).forEach(([name, value]) => {
             grid.style.setProperty(`--wine-${name}-left`, `${value}fr`);
             grid.style.setProperty(`--wine-${name}-right`, `${1 - value}fr`);
           });
           grid.classList.add('home-wine-hover');
         }
         update();
       }
       items.forEach((item, index) => {
         item.addEventListener('pointerenter', event => {
           if (event.pointerType === 'touch' || !desktop.matches) return;
           hovered = index;
           update();
         });
         item.addEventListener('pointerleave', () => { hovered = -1; update(); });
         item.addEventListener('focusin', () => { focused = index; update(); });
         item.addEventListener('focusout', event => {
           if (!item.contains(event.relatedTarget)) { focused = -1; update(); }
         });
       });
       desktop.addEventListener('change', setup);
       let resizeTimer;
       window.addEventListener('resize', () => {
         clearTimeout(resizeTimer);
         resizeTimer = setTimeout(setup, 150);
       }, { passive: true });
       setup();
     });
   });
   