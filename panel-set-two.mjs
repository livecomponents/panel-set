/* Originally written by Brian Kardell */
(function() {
  class PanelSetTwo extends HTMLElement {
    static get observedAttributes() { return [ "display" ]; }

    attributeChangedCallback(name, oldValue, newValue) {
      requestAnimationFrame(() => {
        if (name === "display") {
          if (newValue === "tabs") {
            this.tabSources
              .forEach(tabSource => tabSource.slot = tabSource.id);
          } else {
            this.tabSources
              .forEach(tabSource => tabSource.setAttribute("slot", ""));
          }
          this.shadowRoot.querySelectorAll('slot').forEach(slotEl => {
            if (slotEl.assignedElements().length === 0) {
              slotEl.parentElement.remove()
            }adding support for specifying the active index during declaration, make sure this all works ok on mobile, set attributes instead of AOM reflection uses so this works in all the places and reorient so that it adapts to newly inserted or removed DOM appropriately.
          })
        }
      });
    }

    get tabSources() {
      return Array.from(this.querySelectorAll(":scope>[x-title]"));
    }
    get contentSources() {
      return Array.from(this.querySelectorAll(":scope>[x-content]"));
    }
adding support for specifying the active index during declaration, make sure this all works ok on mobile, set attributes instead of AOM reflection uses so this works in all the places and reorient so that it adapts to newly inserted or removed DOM appropriately.
    set activeTab(tabSource) {
      this.tabSources.forEach((source, i) => {
        let relatedContent = this.querySelector(`#${source.getAttribute("aria-controls")}`);
        if (source === tabSource) {
          relatedContent.style.display = "block";
          this.activeTabIndex = i;
          source.tabIndex = 0;
          if (this.matches(':focus-within')) {
            requestAnimationFrame(() => source.focus());
          }
        } else {
          source.tabIndex = -1;
          relatedContent.style.display = "none";
        }
      });
      this.shadowRoot.querySelectorAll('x-tab').forEach((el, i) => {
        if (i===this.activeTabIndex) {
          el.setAttribute('active','');
        } else {
          el.removeAttribute('active');
        }
      });
    }

    selectNextTab() {
      let tabSources = this.tabSources;
      this.activeTab =
        this.activeTabIndex == tabSources.length - 1
          ? tabSources[0]
          : tabSources[this.activeTabIndex + 1];
    }

    selectPreviousTab() {
      let tabSources = this.tabSources;
      this.activeTab =
        this.activeTabIndex == 0
          ? tabSources[tabSources.length - 1]
          : tabSources[this.activeTabIndex - 1];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :root {
            font-size: 1rem;
          }

          :host([hidden]),
          ::slotted([hidden]) {
            display: none;
          }

          ::slotted(h2[tabIndex="0"]) {
             text-decoration: underline;   
          }
          
         
          :host([theme=default]) [active]{
            border-bottom: 1px solid white;
            position:relative;
            top: 1px;
            z-index: 2;
          }

          :host([theme=default]) x-tab {
            background-color: white;
            margin: 0;
            color: black;
            padding: 0.2rem;
            border: 1px solid lightgray;
          }

          :host([theme=default][display=accordion]) x-tabs {
            display: none;
          } 

          :host([theme=default]) x-tab > ::slotted(*) {
            font-weight: normal;
            color: black;
            margin: 0.2rem;
            text-decoration: none;

          }
          :host([theme=default]) x-tabs {
            background-color: transparent;
            border-bottom: 1px solid lightgray;
            margin: 0;
          }

          :host([theme=default]) [default] {
            display: block;
            margin-top: 0rem;
            padding: 0.5rem;
            background-color: transparent;
            border: 1px solid lightgray;
            border-top: none;
          }
          x-tabs { 
            display: flex; 
          }
          x-tab {
            margin: 0 0.2rem;
            padding: 0 .75rem;
          }
        </style>
        <x-tabs></x-tabs>
        <x-content></x-content>
        <slot default></slot>
    `;

    this.tabsetContainer = this.shadowRoot.querySelector("x-tabs");
    let defaultSlot = this.shadowRoot.querySelector("[default]");
    this.role = "tablist";

    // it might be good to do this on a timeout to let normal parsing happen usually
    // and only fire once?
    defaultSlot.addEventListener("slotchange", e => {
      let assignedEls = e.target.assignedElements();
      let unassignedEls = assignedEls.filter(el => !el._init);
      let titleEls = unassignedEls.filter(el => el.matches("[x-title]"));
      let contentEls = unassignedEls.filter(el => el.matches("[x-content]"));
      let size = Math.min(titleEls.length, contentEls.length);
      let specifiedIndex = this.activeTabIndex || 0;
      
      if (titleEls.length !== size) {
        console.warn("mismatch in panel-set title/content pairs...");
      }
      titleEls.forEach(tabSource => {
        if (!tabSource.matches('h1,h2,h3,h4,h5,h6,[role="heading"]')) {
          console.warn("element marked with x-title should be a heading");
        }
      });

      for (let i = 0; i < size; i++) {
        let tabUId = PanelSetTwo.prototype.nextUid();
        let contentUId = PanelSetTwo.prototype.nextUid();
        let tab = titleEls[i];
        let content = contentEls[i];

        if (tab.hasAttribute('x-active')) {
          specifiedIndex = i;
        }
        
        // tabs are -1, they need to use roving focus :(
        tab.tabIndex = -1;
        tab.setAttribute("role","tab");
        tab.id = tabUId;
        tab.setAttribute("aria-controls", contentUId);
        content.setAttribute("role","tabpanel");
        content.tabIndex = 0;
        content.id = contentUId;
        tab._init = true;
        content._init = true;

        tab.addEventListener("click", evt => {
          this.activeTab = evt.target;
        });

        // build a stub... we have to make sure we don't do this repeatedly
        let range = document.createRange();
        this.tabsetContainer.appendChild(
          range.createContextualFragment(
            `<x-tab><slot name="${tabUId}"></slot></x-tab>`,
            "text/html"
          )
        );
      }
      
      this.activeTabIndex = specifiedIndex;
      this.activeTab = this.tabSources[this.activeTabIndex]
      
      let specifiedDisplay = this.getAttribute('display') || 'accordion'
      if (specifiedDisplay === 'tabs') {
        this.setAttribute('display', 'tabs')
      } else {
        this.setAttribute('display', 'accordion')
      }
    });

    this.addEventListener(
      "keydown",
      evt => {
        switch (evt.keyCode) {
          case 37:
            this.selectPreviousTab();
            break;
          case 38:
            this.selectPreviousTab();
            evt.preventDefault();
            break;
          case 39:
            this.selectNextTab();
            break;
          case 40:
            evt.preventDefault();
            this.selectNextTab();
            break;
        }
      },
      false
    );

  }
}

  PanelSetTwo.prototype.lastUid = 0;
  PanelSetTwo.prototype.nextUid = function() {
    return `cp${++PanelSetTwo.prototype.lastUid}`;
  };

  customElements.define("panel-set-two", PanelSetTwo); 
  
})();
