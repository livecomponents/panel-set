(async function(window, document){
  if(typeof window === 'undefined'){ return; }
  const { initialize } = await import('./panel-set-helpers.mjs');
  const customElementName = 'panel-set';

  if (!window.customElements.get(customElementName)) {
    window.customElements.define(customElementName,
      class PanelSet extends HTMLElement {
        static get observedAttributes() {
          return [];
        }

        constructor(){
          super();
          this.root = null;
          this.activeIndex = null;
          this.activePanel = null;
          this.activeTab = null;
          this.hasRendered = false;
        }

        connectedCallback(){
          if(!this.root) { this.root = this.attachShadow({ mode: 'open' }); }
          initialize(this);
          this.hasRendered = true;
          window.addEventListener('resize', () => initialize(this));
        }
      }
    );
  }

})(window, document);