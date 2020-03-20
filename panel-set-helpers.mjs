export function render (component) {
  if (component.root) {
    const $template = document.createElement('template');
    component.root.innerHTML = '';
    $template.innerHTML = initialTemplate(component);
    component.root.appendChild(document.importNode($template.content, true));
    component.hasRendered = true;
    Array.from(component.querySelectorAll('[slot*="ps:panel"][active]'), (item, ind) => {
      if(ind > 0) { item.removeAttribute('active'); }
    }); 
  }
}

export function initialTemplate (component) {
  return /* html */`
    <style>
      :host {
        display: grid;
      }

      .accordion-summary {
        width: 100%;
        max-width: 100%;
        display: flex;
      }

      .accordion-details {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        overflow: auto;
        border-left: solid 1px #bcbcbc;
        border-right: solid 1px #bcbcbc;
        padding: 0;
        margin: 0;
      }

      ::slotted([slot^='ps:tab']) {
        display: block;
        width: 100%;
        padding: 8px;
        border: solid 1px #bcbcbc;
      }

      ::slotted([slot*='ps:panel']) {
        height: 0px;
        font-size: 0;
        line-height: 0;
        width: 0px;
        text-indent: -9000px;
        left: -100vw;
        position: absolute;
      }

      ::slotted([active]) {
        height: unset;
        font-size: unset;
        line-height: unset;
        width: 100%;
        text-indent: unset;
        left: unset;
        position: static;
      }
      
      @media screen and (min-width: 720px) {
        
        .tab-slots {
          display: flex;
          border-left: solid 1px #bcbcbc;
        }

        .panel-slots {
          border: solid 1px #bcbcbc;
          padding: 8px 16px;
        }
        
        ::slotted([slot^='ps:tab']) {
          width: auto;
          position: relative;
          z-index: 10;
          top: 1px;
          border-bottom-color: rgba(255, 255, 255, 0);
          border-left: none;
        }

        ::slotted([slot^='ps:tab'][active]) {
          border-bottom-color: rgba(255, 255, 255, 1);
        }
      }
    </style>
    <div id="template-container">
      ${renderTemplates(component)}
    </div>
  `;
}

export function renderTemplates(component) {
  return `
    ${renderAccordionSlots(component)}
    ${renderTabSlots(component)}
  `;
}

export function renderTabSlots(component) {
  if (window.matchMedia('screen and (min-width: 720px)').matches) {
    return `
      <nav class="tab-slots" part="ps-tabs">
        ${renderSlots(component, '[slot^="ps:tab-"]')}
      </nav>
      <section class="panel-slots" part="ps-panels">
        ${renderSlots(component, '[slot^="ps:panel-"]')}
      </section>
    `;
  }
  return '';
}

export function renderAccordionSlots(component) {
  if (!window.matchMedia('screen and (min-width: 720px)').matches) {
    const tabSlots = component.querySelectorAll("[slot^='ps:tab']");
    const panelSlots = component.querySelectorAll("[slot^='ps:panel']");
    if (tabSlots && panelSlots && tabSlots.length === panelSlots.length) {
      return [].map.call(tabSlots, (slot, ind) => {
        return /* html */`
          <div class="accordion-section">
            <div class="accordion-summary" part="ps-summary">
              <slot name="${tabSlots[ind].getAttribute('slot')}"></slot>
              <img-icon shape="dropArrow"></img-icon>
            </div>
            <div class="accordion-details" part="ps-details">
              <slot name="${panelSlots[ind].getAttribute('slot')}"></slot>
            </div>
          </div>
        `;
      }).join('\n');
    }
  }
  return '';
}

export function renderSlots(component, nodeListSelector) {
  const nodeList = component.querySelectorAll(nodeListSelector);
  return !!nodeList && Array.from(nodeList, (item) => {
    return !!item ? /* html */`
        <slot name="${item.getAttribute('slot')}"></slot>
    ` : '';
  }).join('\n');
}