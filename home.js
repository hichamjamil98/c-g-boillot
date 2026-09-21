/* ==========================================
   HOME — GALERIE : DÉPLIAGE DU HAUT VERS LE BAS
   Next et Previous : même animation, deux collections synchronisées.
   ========================================== */
   window.Webflow = window.Webflow || [];
   window.Webflow.push(() => {
     document.querySelectorAll('.is--home-gallery').forEach(section => {
       if (section.__homeUnfold) return;
       const previous = section.querySelector('.slide--previous');
       const next = section.querySelector('.slider--next');
       const decks = ['.gallery--group1', '.gallery--group2'].map(selector => {
         const list = section.querySelector(selector)?.querySelector('.w-dyn-items');
         return { list, index: 0, cards: list ? [...list.children].filter(el => el.matches('.w-dyn-item')) : [] };
       }).filter(deck => deck.cards.length);
       if (!decks.length || !previous || !next) return;
       section.__homeUnfold = true;
       const DURATION = 1700;
       const FOLDS = 5;
       const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
       const wrap = (n, length) => (n % length + length) % length;
       const clamp = n => Math.max(0, Math.min(1, n));
       const ease = t => t * t * (3 - 2 * t);
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
   
       // Five connected image bands form a sheet folded like an accordion.
       // Their hinge positions follow the actual projected length of each band.
       function makeSheet(deck, image) {
         const sheet = document.createElement('div');
         sheet.className = 'home-unfold-sheet';
         sheet.setAttribute('aria-hidden', 'true');
         const computed = getComputedStyle(image);
         const bands = Array.from({ length: FOLDS }, (_, i) => {
           const band = document.createElement('div');
           band.className = 'home-unfold-band';
           const copy = document.createElement('img');
           copy.src = image.currentSrc || image.src;
           copy.alt = '';
           copy.draggable = false;
           copy.style.objectFit = computed.objectFit;
           copy.style.objectPosition = computed.objectPosition;
           const shade = document.createElement('span');
           shade.className = 'home-unfold-shade';
           shade.style.background = i % 2
             ? 'linear-gradient(to bottom, rgba(0,0,0,.42), rgba(0,0,0,.08))'
             : 'linear-gradient(to bottom, rgba(255,255,255,.32), rgba(0,0,0,.22))';
           band.append(copy, shade);
           sheet.appendChild(band);
           return { band, copy, shade };
         });
         deck.list.appendChild(sheet);
         return { sheet, bands };
       }
       function draw({ sheet, bands }, progress) {
         const width = sheet.clientWidth;
         const height = sheet.clientHeight;
         const strip = height / FOLDS;
         let y = -Math.min(18, height * .05) * (1 - ease(clamp(progress / .5)));
         let z = 0;
         sheet.style.opacity = String(ease(clamp(progress / .1)));
         bands.forEach(({ band, copy, shade }, i) => {
           const opening = ease(clamp((progress - i * .065) / .72));
           const angle = (1 - opening) * 78 * (i % 2 ? -1 : 1);
           const radians = angle * Math.PI / 180;
           band.style.height = `${strip + .3}px`;
           band.style.transform = `translate3d(0, ${y}px, ${z}px) rotateX(${angle}deg)`;
           copy.style.width = `${width}px`;
           copy.style.height = `${height}px`;
           copy.style.top = `${-i * strip}px`;
           shade.style.opacity = String(1 - opening);
           y += Math.cos(radians) * strip;
           z += Math.sin(radians) * strip;
         });
       }
       async function move(direction) {
         if (busy || decks.every(deck => deck.cards.length < 2)) return;
         busy = true;
         controls();
         const changes = decks.filter(deck => deck.cards.length > 1)
           .map(deck => ({ deck, target: wrap(deck.index + direction, deck.cards.length) }));
         const sheets = [];
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
             changes.forEach(({ deck }, i) => {
               if (images[i] && deck.list.clientWidth && deck.list.clientHeight) {
                 const sheet = makeSheet(deck, images[i]);
                 draw(sheet, 0);
                 sheets.push(sheet);
               }
             });
             if (sheets.length) await new Promise(resolve => {
               let start;
               function frame(now) {
                 start ??= now;
                 const progress = clamp((now - start) / DURATION);
                 sheets.forEach(sheet => draw(sheet, progress));
                 if (progress < 1 && !reduced.matches) requestAnimationFrame(frame);
                 else resolve();
               }
               requestAnimationFrame(frame);
             });
           }
         } catch (error) {
           console.warn('Home gallery:', error);
         } finally {
           changes.forEach(({ deck, target }) => { deck.index = target; });
           decks.forEach(render);
           sheets.forEach(({ sheet }) => sheet.remove());
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
   