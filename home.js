/* ==========================================
   HOME — GALLERY: CINEMATIC CARD DEAL
   Keep group width and height in Webflow. No additional library required.
   ========================================== */
   window.Webflow = window.Webflow || [];
   window.Webflow.push(() => {
     document.querySelectorAll('.is--home-gallery').forEach(section => {
       if (section.__homeDealStack) return;
       const previous = section.querySelector('.slide--previous');
       const next = section.querySelector('.slider--next');
       const decks = ['.gallery--group1', '.gallery--group2'].map((selector, side) => {
         const list = section.querySelector(selector)?.querySelector('.w-dyn-items');
         return { list, side: side ? 1 : -1, index: 0,
           cards: list ? [...list.children].filter(el => el.matches('.w-dyn-item')) : [] };
       }).filter(deck => deck.cards.length);
       if (!decks.length || !previous || !next) return;
       section.__homeDealStack = true;
       section.classList.add('home-gallery-ready');
       const reduced = matchMedia('(prefers-reduced-motion: reduce)');
       const compact = matchMedia('(max-width: 991px)');
       const DURATION = 950;
       const MAX_TILT = 4;
       const wrap = (n, length) => (n % length + length) % length;
       const random = (min, max) => min + Math.random() * (max - min);
       const transform = (x, y, angle, scale = 1, rx = 0, ry = 0) =>
         `perspective(1200px) translate3d(${x}%, ${y}%, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${angle}deg) scale(${scale})`;
       const shadow = '0 12px 24px -12px rgba(24,30,23,.28), 0 2px 5px rgba(24,30,23,.10)';
       let busy = false;
       function controls() {
         const disabled = busy || decks.every(deck => deck.cards.length < 2);
         [previous, next].forEach(button => button.setAttribute('aria-disabled', String(disabled)));
         section.setAttribute('aria-busy', String(busy));
       }
       function pose(deck, card, order = deck.order) {
         const depth = order.length - 1 - order.indexOf(card);
         const visibleDepth = Math.min(depth, 2);
         return {
           transform: transform(deck.side * visibleDepth * 1.2, visibleDepth * 2.2,
             card.__dealAngle, 1 - visibleDepth * .035),
           boxShadow: shadow,
           opacity: depth < 3 ? '1' : '0'
         };
       }
       function render(deck) {
         deck.cards.forEach((card, index) => {
           const active = index === deck.index;
           const depth = deck.order.length - 1 - deck.order.indexOf(card);
           Object.assign(card.style, pose(deck, card), {
             visibility: depth < 3 ? 'visible' : 'hidden',
             zIndex: String(deck.order.indexOf(card) + 1),
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
         deck.order = [...deck.cards].reverse();
         deck.cards.forEach((card, i) => {
           card.classList.add('home-card');
           card.__dealAngle = i === 0 ? deck.side * 1.4 : (i % 2 ? -1 : 1) * random(2, MAX_TILT);
           card.querySelectorAll('.home-card-fold').forEach(fold => fold.remove());
         });
         render(deck);
       });
       async function move(direction) {
         if (busy || decks.every(deck => deck.cards.length < 2)) return;
         busy = true;
         controls();
         const animations = [];
         const changes = decks.filter(deck => deck.cards.length > 1).map(deck => {
           const target = wrap(deck.index + direction, deck.cards.length);
           const incoming = deck.cards[target];
           const angle = deck.cards[deck.index].__dealAngle >= 0 ? random(-MAX_TILT, -1.5) : random(1.5, MAX_TILT);
           return { deck, target, incoming, angle, order: [...deck.order.filter(card => card !== incoming), incoming] };
         });
         try {
           await Promise.all(changes.map(({ incoming }) => Promise.all(
             [...incoming.querySelectorAll('img')].map(image => {
               image.loading = 'eager';
               if (!image.decode) return Promise.resolve();
               return new Promise(resolve => {
                 const timer = setTimeout(resolve, 2000);
                 Promise.resolve().then(() => image.decode()).catch(() => {}).finally(() => {
                   clearTimeout(timer); resolve();
                 });
               });
             })
           )));
           if (!reduced.matches && typeof Element.prototype.animate === 'function') {
             changes.forEach(({ deck, incoming, angle, order }, index) => {
               const side = deck.side * direction;
               const amplitude = compact.matches ? .5 : 1;
               const delay = index * 90;
               // Keep the new stack underneath the airborne card.
               deck.cards.forEach(card => {
                 if (card === incoming) return;
                 const from = pose(deck, card);
                 const to = pose(deck, card, order);
                 card.style.visibility = 'visible';
                 card.style.zIndex = String(order.indexOf(card) + 1);
                 card.style.willChange = 'transform';
                 animations.push(card.animate([from, to], {
                   duration: DURATION, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'
                 }));
               });
               Object.assign(incoming.style, {
                 visibility: 'visible', zIndex: String(deck.cards.length + 1),
                 pointerEvents: 'none', willChange: 'transform, opacity'
               });
               // A raised card lands, gently overshoots, then settles into the pile.
               animations.push(incoming.animate([
                 { offset: 0, transform: transform(side * 27 * amplitude, -36 * amplitude,
                     angle + side * 15 * amplitude, 1.075, 12 * amplitude, -side * 12 * amplitude),
                   boxShadow: '0 42px 45px -12px rgba(24,30,23,.30)',
                   easing: 'cubic-bezier(.18,.72,.26,1)' },
                 { offset: .72, transform: transform(-side * .7, 1.3, angle - side * .8, .993),
                   boxShadow: '0 5px 12px -5px rgba(24,30,23,.24)',
                   easing: 'cubic-bezier(.22,1,.36,1)' },
                 { offset: 1, transform: transform(0, 0, angle), boxShadow: shadow }
               ], { duration: DURATION, delay, fill: 'both' }));
               animations.push(incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
                 duration: 120, delay, fill: 'both', easing: 'ease-out'
               }));
             });
             await Promise.all(animations.map(animation => animation.finished));
           }
         } catch (error) {
           console.warn('Home gallery:', error);
         } finally {
           changes.forEach(({ deck, target, incoming, angle, order }) => {
             incoming.__dealAngle = angle;
             deck.index = target;
             deck.order = order;
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
         if (!button.hasAttribute('tabindex')) button.tabIndex = 0;
         button.addEventListener('click', event => { event.preventDefault(); move(direction); });
         button.addEventListener('keydown', event => {
           const nativeButton = button.tagName === 'BUTTON';
           const nativeLink = button.tagName === 'A' && button.hasAttribute('href');
           if ((event.key === ' ' && !nativeButton) || (event.key === 'Enter' && !nativeButton && !nativeLink)) {
             event.preventDefault(); move(direction);
           }
         });
       });
       controls();
     });
   });
   
   /* ==========================================
         HOME — CURSOR: SMOOTH HOVER FOLLOW
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
         HOME — WINES: HOVER EXPANSION
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
      