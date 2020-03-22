# Development
### Setup
To initialize this component for all supported browsers, you must add scripts to the head of the document that point to their URL location.

#### Initialization HTML
```html
<!-- OPTIONAL: preloaded dependency for a performance boost -->
<link rel="preload" crossorigin href="utils.mjs" crossorigin as="script"/>

<!-- REQUIRED: main module for modern Evergreen browsers  (Safari, Edge, Chrome, Mobile Safari, and Firefox) -->
<script crossorigin type="module" src="https://somecdn.com/@livecomponents/panel-set/master/panel-set.mjs"></script>

<!-- OPTIONAL: fallback module if BASIC STYLING and MINIMAL FUNCTIONAL SUPPORT for older browsers -->
<script crossorigin nomodule type="text/javascript" src="https://somecdn.com/livecomponents/panel-set/master/panel-set.js"></script>
```

#### HTML Content (for SEO)*
This is the HTML required to be on page before Google/Bing can scan the page for their indexing algorithms. This is usually achieved via 'prerendering' or 'server side rendering (SSR)'. None of the JavaScript or CSS for the `<panel-set />` is necessary for the page to be indexed. No content is required by default to be indexed by search engines but here is an HTML example of how you can add content that will be indexed.

```html
  <panel-set active-index="0">
    <a href="" slot="ps:tab-1">panel title </a>
    <div slot="ps:panel-1">
      panel content
    </div>
  </panel-set>
```

### Theming
Set these values to get different themes.

**Custom Properties**
| **Variable Name** | **Default Value** |
| --- | --- |
| `--ps--border-color` | `#bcbcbc` |
| `--ps--tab-border-color` | `rgba(255, 255, 255, 0)` |
| `--ps--tab-border-color--active` | `rgba(255, 255, 255, 1)` |
| `--ps--tab-text-color` | `inherit` |

**Shadow Parts (*)**
| **Part Name** | **Summary** |
| --- | --- |
| `ps-summary` | |
| `ps-details` | |
| `ps-tabs` | |
| `ps-panels` | |

(*) Not Supported in Webkit based browsers

### Attributes
none
<!-- | **name** | **summary** | **expected value** |
| --- | --- | --- | -->

### Slots
| **name** | **summary** | **type** | **SEO Requirement** |
| --- | --- | --- | --- |
| `ps:tab-*` | These are the panel tab links | dynamic | ❌ |
| `ps:panel-*` | These are panel tab content areas | dynamic | ❌ |
*(*) can be multiple elements - each incremented by an integer starting with `1`*

<!-- ✅ or ❌ -->

### Custom Event Hooks
| **name** | **detail data** | **summary** |
| --- | --- | --- |
| `ps:change` | `{ activeIndex: number | null, activeTab: DOMNode | null, activePanel: DOMNode | null}` | triggers when 'active' attribute is updated on any slot |

## Dependencies
npne
<!-- | **name** | **location** | **type** | **reason** | **swappable** |
| --- | --- | --- | --- | --- |
| `<no-element>` | `https://somecdn.com/jkjlkjlkjl` | External Custom Element | provides something cool | ✅ or ❌ | -->

## Customization

### Hiding Slots
There might be times where you want to hide a slot but remove the default value. To do this you must add the slot as normal but add an additional 'hidden' attribute to it.
```html
<panel-set>
  <!-- other slots can go here ... -->
  <a href="" hidden slot="ps:tab-1">First Item Title</a>
</panel-set>
``` 

#### Current SEO Requirements 
none

## Base CSS
Please note that some CSS is injected to the head of the document on initialization of this codebase (ONLY once). This is done to insure that some styling for slots does not get broken by any CSS reset the application.

<!--
## NPM Scripts
| **command** | **summary** |
| --- | --- |
| `npm run build` | handles compression. The main file is compressed to brotli and the fallback file (or 'nomodule' file) is compressed to gzip |
| `npm run test` | runs `npm run test:unit` and `npm run test:e2e` |
| `npm run test:unit` | runs unit tests | 
| `npm run test:e2e` | runs end-to-end tests |
| `npm run start` | runs an dev server to test the component (port 5000) |
-->