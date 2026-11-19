(() => {
    "use strict";
  
    const KEYS = ["pays", "ville", "type"];
    const DEFAULT_LABELS = {
      pays: "Tous les pays",
      ville: "Toutes les villes",
      type: "Tous les types"
    };
    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const normalize = (value) => clean(value).normalize("NFKC").toLocaleLowerCase("fr");
    const collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });
  
    function initSection(section, sectionIndex) {
      if (section.hasAttribute("data-carnet-filter-ready")) return;
  
      const list = section.querySelector(".collection--carnet");
      if (!list) return;
  
      const controls = KEYS.map((key) => {
        const wrapper = section.querySelector(`[filter-item="${key}"]`);
        const trigger = wrapper?.querySelector(".filter--drop");
        const label = trigger?.querySelector("p");
        const panel = wrapper?.querySelector(".filter--drop-list");
        if (!wrapper || !trigger || !label || !panel) return null;
  
        return {
          key, wrapper, trigger, label, panel,
          defaultLabel: clean(label.textContent) || DEFAULT_LABELS[key],
          options: []
        };
      });
      if (controls.some((control) => !control)) return;
  
      const selected = Object.fromEntries(KEYS.map((key) => [key, ""]));
      const records = Array.from(list.children)
        .filter((element) => element.matches(".w-dyn-item"))
        .map((element) => {
          const values = {};
          const labels = {};
          KEYS.forEach((key) => {
            labels[key] = Array.from(element.querySelectorAll(`[filter="${key}"] .text--info`))
              .map((node) => clean(node.textContent))
              .filter(Boolean);
            values[key] = new Set(labels[key].map(normalize));
          });
          return { element, values, labels };
        });
  
      let openControl = null;
      let refreshFrame = 0;
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "carnet--filter-empty";
      emptyMessage.setAttribute("role", "status");
      emptyMessage.textContent = "Aucun établissement ne correspond à votre sélection.";
      emptyMessage.hidden = true;
      list.after(emptyMessage);
  
      function closeMenus(restoreFocus = false) {
        const previous = openControl;
        controls.forEach(({ wrapper, trigger, panel }) => {
          wrapper.classList.remove("is--filter-open");
          trigger.setAttribute("aria-expanded", "false");
          panel.setAttribute("aria-hidden", "true");
          panel.inert = true;
        });
        openControl = null;
        if (restoreFocus && previous) previous.trigger.focus();
      }
  
      function openMenu(control) {
        closeMenus();
        openControl = control;
        control.wrapper.classList.add("is--filter-open");
        control.trigger.setAttribute("aria-expanded", "true");
        control.panel.setAttribute("aria-hidden", "false");
        control.panel.inert = false;
      }
  
      function applyFilters() {
        let visibleCount = 0;
        records.forEach(({ element, values }) => {
          const matches = KEYS.every((key) => !selected[key] || values[key].has(selected[key]));
          element.hidden = !matches;
          if (matches) visibleCount += 1;
          element.classList.toggle("is--filter-even", matches && visibleCount % 2 === 0);
        });
        emptyMessage.hidden = visibleCount !== 0;
  
        /* Refresh existing scroll animations after the list height changes. */
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          if (typeof window.ScrollTrigger?.refresh === "function") {
            window.ScrollTrigger.refresh();
          }
          section.dispatchEvent(new CustomEvent("carnet:filtered", {
            bubbles: true,
            detail: { visibleCount, totalCount: records.length, filters: { ...selected } }
          }));
        });
      }
  
      function selectOption(control, value, text) {
        selected[control.key] = value;
        control.label.textContent = value ? text : control.defaultLabel;
        control.wrapper.classList.toggle("is--filter-selected", Boolean(value));
        control.options.forEach((option) => {
          option.setAttribute("aria-pressed", String(option.dataset.filterValue === value));
        });
        closeMenus(true);
        applyFilters();
      }
  
      controls.forEach((control) => {
        const { key, wrapper, trigger, label, panel, defaultLabel } = control;
        const idPrefix = `carnet-filter-${sectionIndex + 1}-${key}`;
        trigger.id ||= `${idPrefix}-trigger`;
        panel.id ||= `${idPrefix}-panel`;
        trigger.setAttribute("role", "button");
        trigger.setAttribute("aria-controls", panel.id);
        trigger.setAttribute("aria-expanded", "false");
        if (trigger.tagName === "BUTTON") trigger.type = "button";
        if (!trigger.hasAttribute("href") && trigger.tagName !== "BUTTON") trigger.tabIndex = 0;
        label.setAttribute("data-carnet-filter-label", "");
        panel.setAttribute("role", "group");
        panel.setAttribute("aria-label", defaultLabel);
        panel.setAttribute("aria-hidden", "true");
        panel.inert = true;
        wrapper.classList.remove("is--filter-open", "is--filter-selected");
  
        /* Values always come from the complete rendered list, not filtered results. */
        const uniqueValues = new Map();
        records.forEach((record) => {
          record.labels[key].forEach((text) => {
            const value = normalize(text);
            if (!uniqueValues.has(value)) uniqueValues.set(value, text);
          });
        });
        const entries = [["", defaultLabel], ...Array.from(uniqueValues)
          .sort((first, second) => collator.compare(first[1], second[1]))];
        const fragment = document.createDocumentFragment();
        entries.forEach(([value, text]) => {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "filter--option";
          option.dataset.filterValue = value;
          option.textContent = text;
          option.setAttribute("aria-pressed", String(value === ""));
          option.addEventListener("click", () => selectOption(control, value, text));
          control.options.push(option);
          fragment.append(option);
        });
        panel.replaceChildren(fragment);
  
        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          if (openControl === control) closeMenus();
          else openMenu(control);
        });
  
        trigger.addEventListener("keydown", (event) => {
          const isNativeButton = trigger.tagName === "BUTTON";
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(control);
            const current = control.options.find((option) => option.getAttribute("aria-pressed") === "true");
            (event.key === "ArrowUp" ? control.options.at(-1) : current || control.options[0])?.focus();
          } else if (!isNativeButton && (event.key === " " || (event.key === "Enter" && !trigger.hasAttribute("href")))) {
            event.preventDefault();
            trigger.click();
          }
        });
  
        panel.addEventListener("keydown", (event) => {
          const index = control.options.indexOf(document.activeElement);
          if (index < 0) return;
          let nextIndex;
          if (event.key === "ArrowDown") nextIndex = (index + 1) % control.options.length;
          else if (event.key === "ArrowUp") nextIndex = (index - 1 + control.options.length) % control.options.length;
          else if (event.key === "Home") nextIndex = 0;
          else if (event.key === "End") nextIndex = control.options.length - 1;
          if (nextIndex !== undefined) {
            event.preventDefault();
            control.options[nextIndex].focus();
          }
        });
      });
  
      const reset = section.querySelector('[filter-item="reset"]');
      if (reset) {
        const resetButton = reset.matches("a, button") ? reset : reset.querySelector("a, button");
        if (resetButton?.tagName === "BUTTON") resetButton.type = "button";
        reset.addEventListener("click", (event) => {
          event.preventDefault();
          closeMenus();
          controls.forEach((control) => {
            selected[control.key] = "";
            control.label.textContent = control.defaultLabel;
            control.wrapper.classList.remove("is--filter-selected");
            control.options.forEach((option) => {
              option.setAttribute("aria-pressed", String(option.dataset.filterValue === ""));
            });
          });
          applyFilters();
        });
      }
  
      document.addEventListener("click", (event) => {
        if (openControl && !openControl.wrapper.contains(event.target)) closeMenus();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && openControl) {
          event.preventDefault();
          closeMenus(true);
        }
      });
      document.addEventListener("focusin", (event) => {
        if (openControl && !openControl.wrapper.contains(event.target)) closeMenus();
      });
  
      section.setAttribute("data-carnet-filter-ready", "");
      closeMenus();
      applyFilters();
    }
  
    function init() {
      document.querySelectorAll(".section.is--carnet").forEach(initSection);
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  })();
  