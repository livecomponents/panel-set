export function render (component, templ) {
  if (component.root) {
    const $template = document.createElement('template');
    component.root.innerHTML = '';
    $template.innerHTML = templ(component);
    component.root.appendChild(document.importNode($template.content, true));
    component.hasRendered = true;
  }
}

export function tabTemplate (component) {
  return /* html */`
    <style>
      :host {
        display: grid;
      }
      ::slotted([slot^='ps:panel']) {
        display: none;
      }
      ::slotted([slot^='ps:panel'][active]) {
        display: block;
      }
    </style>
    <nav class="tab-slots" part="ps-tabs">
      ${renderSlots(component, '[slot^="ps:tab-"]')}
    </nav>
    <section class="panel-slots" part="ps-panels">
      ${renderSlots(component, '[slot^="ps:panel-"]')}
    </section>
  `;
}

export function accordionTemplate (component) {
  return /* html */`
    <style>
      .accordion-summary {
        width: 100%;
        display: flex;
      }
      .accordion-details {
        width: 100%;
      }
    </style>
    ${renderAccordionSlots(component)}
  `;
}

export function renderAccordionSlots(component) {
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