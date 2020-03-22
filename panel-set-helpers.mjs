export function render (component) {
  if (component.root) {
    const $template = document.createElement('template');
    component.root.innerHTML = '';
    $template.innerHTML = initialTemplate(component);
    component.root.appendChild(document.importNode($template.content, true));
    component.hasRendered = true;
    Array.from(component.querySelectorAll('[slot*="ps:panel"][active]'), (item, ind) => {
      if(ind > 0) {
        item.removeAttribute('active');
      } else {
        component.activeIndex = ind;
        component.activePanel = item;
        component.activeTab = component.querySelectorAll('[slot*="ps:tab"][active]')[ind]
      }
    }); 
  }
}

export function initialTemplate (component) {
  const isTablet = window.matchMedia('screen and (min-width: 720px)').matches;
  const tabSlots = component.querySelectorAll("[slot^='ps:tab']");
  const panelSlots = component.querySelectorAll("[slot^='ps:panel']");
  if (tabSlots && panelSlots && tabSlots.length === panelSlots.length) {
    return /* html */`
      <style>
        ${css()}
      </style>
      <div id="template-container">
        ${Array.from(tabSlots, (slot, ind) => {
          if(!panelSlots[ind] || !tabSlots[ind]) { return ''; }
          return /* html */`
            <details data-detail-index="${ind}" ${!!panelSlots[ind].getAttribute('active') ? 'open="true"' : ''} class="accordion-section">
              <summary class="accordion-summary" part="ps-summary">
                ${!isTablet ? `<slot name="${tabSlots[ind].getAttribute('slot')}"></slot>` : ''}
              </summary>
              ${!isTablet ? `<slot class="accordion-details" part="ps-details" name="${panelSlots[ind].getAttribute('slot')}"></slot>` : ''}
            </details>
          `;
        }).join('\n')}
        <nav class="tab-slots" part="ps-tabs">
          ${isTablet ? renderSlots(component, '[slot^="ps:tab-"]') : ''}
        </nav>
        <section class="panel-slots" part="ps-panels">
          ${isTablet ? renderSlots(component, '[slot^="ps:panel-"]') : ''}
        </section>
      </div>
    `;
  }
}

export function css() {
  return /* css */`
    :host {
      display: grid;
    }

    .tab-slots,
    .panel-slots {
      display: none;
    }

    .accordion-summary {
      width: 100%;
      max-width: 100%;
      display: flex;
      align-items: center;
      color: var(--ps--summary-text-color, #fff);
      background-color: var(--ps--summary-bkg-color, #bcbcbc);
    }

    .accordion-details {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      overflow: auto;
      border-left: solid 1px var(--ps--border-color, #bcbcbc);
      border-right: solid 1px var(--ps--border-color, #bcbcbc);
      padding: 0;
      margin: 0;
    }

    ::slotted([slot^='ps:tab']) {
      display: block;
      width: 100%;
      padding: 8px;
      text-decoration: none;
    }

    ::slotted([slot^='ps:tab']:active),
    ::slotted([slot^='ps:tab']:visited) {
      color: var(--ps--summary-text-color, #fff);
    }

    ::-webkit-details-marker {
      border: none;
      padding: 8px;
    }
      
    ::slotted([slot^='ps:tab']:active),
    ::slotted([slot^='ps:tab']:visited) {
      color: var(--ps--tab-text-color, inherit);
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

    ::slotted([slot^='ps:tab']) {
      display: inline-block;
      width: 75%;
      position: relative;
      z-index: 10;
      top: 1px;
      border: solid 1px var(--ps--border-color, #bcbcbc);
      border-bottom-color: var(--ps--tab-border-color, rgba(255, 255, 255, 0));
      border-left: none;
    }

    @media screen and (min-width: 720px) {
      ::slotted([slot^='ps:tab']) {
        display: unset;
        width: auto;
      }

      ::slotted([slot^='ps:tab'][active]) {
        border-bottom-color: var(--ps--tab-border-color--active, rgba(255, 255, 255, 1));
      }

      .tab-slots {
        display: flex;
        border-left: solid 1px var(--ps--border-color, #bcbcbc);
      }

      .panel-slots {
        display: block;
        border: solid 1px var(--ps--border-color, #bcbcbc);
        padding: 8px 16px;
      }

      .accordion-section {
        display: none;
      }
    } 
  `;
}

export function renderSlots(component, nodeListSelector) {
  const nodeList = component.querySelectorAll(nodeListSelector);
  return !!nodeList && Array.from(nodeList, (item) => {
    return !!item ? /* html */`<slot name="${item.getAttribute('slot')}"></slot>` : '';
  }).join('\n');
}

export function eventControllers(component){
  const tabs = component.querySelectorAll("[slot^='ps:tab']");
  const details = component.root.querySelectorAll("details");
  const panels = component.querySelectorAll("[slot^='ps:panel']");
  return Array.from(tabs).map((el, indx) => {
    const evtFn = (evt) => {
      evt.preventDefault();
      if(panels && panels[indx]) {
        Array.from(panels)
          .concat(Array.from(tabs))
          .forEach((item, ind) => {
            if(details[ind]) { details[ind].removeAttribute('open'); }
            item.removeAttribute('active');
          });
        tabs[indx].setAttribute('active', 'true');
        panels[indx].setAttribute('active', 'true');
        details[indx].setAttribute('open', 'true');
        component.activeIndex = indx;
        component.activePanel = panels[indx];
        component.activeTab = tabs[indx];
        component.dispatchEvent(new CustomEvent('ps:activeChanged', { detail: {
          activeIndex: indx,
          activePanel: panels[indx],
          activeTab: tabs[indx]
        }
        }));
      }
    };      
    tabs[indx].addEventListener('click', evtFn, false);
  });
}

export async function initialize(component) {
  await render(component);
  eventControllers(component);
}