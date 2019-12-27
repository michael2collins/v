//https://github.com/andreasbm/masonry-layout
//https://codepen.io/andreasbm/pen/bGGjNbv

const DEFAULT_MAX_COL_WIDTH = 400;
const DEFAULT_COLS = "auto";
const DEFAULT_DEBOUNCE_MS = 300;
const DEBOUNCE_MAP = new Map();
const DEFAULT_GAP_PX = 12;

/**
 * Returns number attribute and defaults to a given value.
 * @param $elem
 * @param name
 * @param defaultValue
 */
function getNumberAttribute($elem, name, defaultValue) {
  const value = parseFloat($elem.getAttribute(name) || "");
  return isNaN(value) ? defaultValue : value;
}

/**
 * Returns the amount of cols that the masonry grid should have.
 * @param totalWidth
 * @param cols
 * @param maxColWidth
 */
function getColCount(totalWidth, cols, maxColWidth) {
  return isNaN(cols) ? Math.max(1, Math.floor(totalWidth / maxColWidth)) : cols;
}

/**
 * Debounces a function.
 * @param cb
 * @param ms
 * @param id
 */
function debounce(cb, ms, id) {
  const existingTimeout = DEBOUNCE_MAP.get(id);
  if (existingTimeout != null) window.clearTimeout(existingTimeout);
  DEBOUNCE_MAP.set(id, window.setTimeout(() => {
    DEBOUNCE_MAP.delete(id);
    cb();
  }, ms));
}

/**
 * Returns the index of the column with the smallest height.
 * @param colHeights
 */
function findSmallestColIndex(colHeights) {
  let smallestIndex = 0;
  let smallestHeight = Infinity;
  colHeights.forEach((height, i) => {
    if (height < smallestHeight) {
      smallestHeight = height;
      smallestIndex = i;
    }
  });

  return smallestIndex;
}

const $template = document.createElement("template");
$template.innerHTML = `
  <style>
    :host {
      display: flex;
      align-items: flex-start;
      justify-content: stretch;
    }

.item {
  height: 100px;
  width: 100%;
  object-fit: cover;
  background-color: lightgrey;
  transition: 100ms ease height;
}
    .column {
      width: 100%;
    }

    .column:not(:last-child) {
      margin-right: var(--masonry-layout-gap, ${DEFAULT_GAP_PX}px);
    }

    ::slotted(*) {
      margin-bottom: var(--masonry-layout-gap, ${DEFAULT_GAP_PX}px);
      box-sizing: border-box;
    }

    /* Hide the items that has not yet found the correct slot */
    #unset-items {
      opacity: 0;
      position: absolute;
      pointer-events: none;
    }
  </style>
  <div id="unset-items">
    <slot></slot>
  </div>
`;

// Use polyfill only in browsers that lack native Shadow DOM.
window.ShadyCSS &&
  window.ShadyCSS.prepareTemplateStyles($template, "masonry-layout");

class MasonryLayout extends HTMLElement {
  // The observed attributes.
  // Whenever one of these changes we need to update the layout.
  static get observedAttributes() {
    return ["maxcolwidth", "gap", "cols"];
  }

  /**
   * The maximum width of each column if cols are set to auto.
   * @attr maxcolwidth
   * @param v
   */
  set maxColWidth(v) {
    this.setAttribute("maxcolwidth", v.toString());
  }

  get maxColWidth() {
    return getNumberAttribute(this, "maxcolwidth", DEFAULT_MAX_COL_WIDTH);
  }

  /**
   * The amount of columns.
   * @attr cols
   * @param v
   */
  set cols(v) {
    this.setAttribute("cols", v.toString());
  }

  get cols() {
    return getNumberAttribute(this, "cols", DEFAULT_COLS);
  }

  /**
   * The gap in pixels between the columns.
   * @attr cols
   * @param v
   */
  set gap(v) {
    this.setAttribute("gap", v.toString());

  }

  get gap() {
    return getNumberAttribute(this, "gap", DEFAULT_GAP_PX);
  }

  /**
   * The ms of debounce when the element resizes.
   * @attr debounce
   * @param v
   */
  set debounce(v) {
    this.setAttribute("debounce", v.toString());
  }

  get debounce() {
    return getNumberAttribute(this, "debounce", DEFAULT_DEBOUNCE_MS);
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild($template.content.cloneNode(true));

    this.onSlotChange = this.onSlotChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.layout = this.layout.bind(this);

    // Unique debounce ID so different masonry layouts on one page won't affect eachother
    this.debounceId = `layout_${Math.random()}`;

    // Prepare a weakmap for the cache
    this.cachedReads = new WeakMap();
  }

  connectedCallback() {
    this.$unsetElementsSlot = this.shadowRoot.querySelector(
      "#unset-items > slot"
    );
    this.$unsetElementsSlot.addEventListener("slotchange", this.onSlotChange);

    // Attach resize observer so we can relayout eachtime the size changes
    if ("ResizeObserver" in window) {
      this.ro = new ResizeObserver(this.onResize);
      this.ro.observe(this);
    } else {
      window.addEventListener("resize", this.onResize);
    }
  }

  /**
   * Updates the layout when the observed attributes changes.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "gap":
        this.style.setProperty(`--masonry-layout-gap`, `${this.gap}px`);
        break;
    }

    this.scheduleLayout();
  }

  onSlotChange() {
    const $unsetElements = this.$unsetElementsSlot
      .assignedNodes()
      .filter(node => node.nodeType === 1);

    // If there are more items not yet set layout straight awy to avoid the item being delayed in its render.
    if ($unsetElements.length > 0) {
      this.layout();
    }
  }

  onResize(entries) {
    const { contentRect } = entries[0];

    const colCount = getColCount(
      contentRect.width,
      this.cols,
      this.maxColWidth
    );

    if (colCount !== this.currentColCount) {
      this.scheduleLayout(true);
    }
  }

  clearCols() {
    const $columns = Array.from(this.shadowRoot.querySelectorAll(".column"));
    for (const $column of $columns) {
      $column.remove();
    }
  }

  renderCols(colCount) {
    
    // Get the current columns
    const $columns = Array.from(this.shadowRoot.querySelectorAll(".column"));

    // If the amount of columns is correct we don't have to add ned columns.
    if ($columns.length === colCount) {
      return;
    }

    // Remove all of the current columns
    for (const $column of $columns) {
      $column.remove();
    }

    // Add some new columns
    for (let i = 1; i <= colCount; i++) {
      const $column = document.createElement("div");
      $column.classList.add("column");

      const $slot = document.createElement("slot");
      $slot.setAttribute("name", i.toString());

      $column.appendChild($slot);
      this.shadowRoot.appendChild($column);
    }
  }

  scheduleLayout(ms = this.debounce, invalidateCache = false) {
    debounce(() => this.layout(invalidateCache), ms, this.debounceId);
  }

  cacheRead($elem) {
    const value = {
      height: $elem.getBoundingClientRect().height
    };

    this.cachedReads.set($elem, value);
    return value;
  }

  layout(invalidateCache = false) {
    requestAnimationFrame(() => {
      console.time("layout");
      const gap = this.gap;

      const $elements = Array.from(this.children).filter(
        node => node.nodeType === 1
      );

      const colCount = getColCount(
        this.offsetWidth,
        this.cols,
        this.maxColWidth
      );

      // Have an array that keeps track of the highest col height.
      const colHeights = Array(colCount).fill(0);

      // Writes
      const writes = [];

      //const writes = Array($elements.length).fill(null);
      for (const $elem of $elements) {
        
        // Get the read data of the item (and cache it while doing it)
        let { height } =
          invalidateCache || !this.cachedReads.has($elem)
            ? this.cacheRead($elem)
            : this.cachedReads.get($elem);

        // Find the currently smallest column
        let smallestColIndex = findSmallestColIndex(colHeights);

        // Add the height of the item to the column heights (include the gap)
        colHeights[smallestColIndex] += height + gap;

        // Set the slot on the element only if the slot has changed
        const newSlot = smallestColIndex + 1;
        if ($elem.slot !== newSlot.toString()) {
          writes.push(() => ($elem.slot = newSlot));
        }
      }

      // Batch all the writes
      for (const write of writes) {
        write();
      }

      // Render the columns
      this.renderCols(colCount);

      // Store the current col count
      this.currentColCount = colCount;

      // Commit the changes for ShadyCSS
      window.ShadyCSS && window.ShadyCSS.styleElement(this);
       console.timeEnd("layout");
    });
  }
}

window.customElements.define("masonry-layout", MasonryLayout);

