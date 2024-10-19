interface AccordionConfig {
  allowMultiple: boolean
  defaultOpen: number[]
}

class AccordionElement extends HTMLElement {
  static observedAttributes = ["allow-multiple", "default-open"]

  private config: AccordionConfig = {
    allowMultiple: false,
    defaultOpen: [],
  }

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.init()
    this.render()
  }

  private init() {
    this.config.allowMultiple = this.hasAttribute("allow-multiple")
    const defaultOpen = this.getAttribute("default-open")
    if (defaultOpen) this.config.defaultOpen = defaultOpen.split(",").map(Number)
  }

  private render() {
    // Return if shadowRoot is not available
    if (!this.shadowRoot) {
      console.warn("Shadow DOM is not available")
      return
    }
    this.shadowRoot.innerHTML = `<slot></slot>`
    const slot = this.shadowRoot.querySelector("slot")
    // Return if slot is not available
    if (!slot) {
      console.warn("No slot found")
      return
    }
    // Listen for slot change
    slot.addEventListener("slotchange", () => {
      const assignedElements = slot.assignedElements()
      const accordion = assignedElements.find((el) => el.classList.contains("accordion"))
      if (!accordion) {
        console.warn("No accordion element found")
        return
      }
      const items = accordion.querySelectorAll(".accordion-item")
      items.forEach((item, i) => {
        // Add active class to default open items
        if (this.config.defaultOpen.includes(i)) item.classList.add("active")
        const trigger = item.querySelector(".accordion-trigger")
        if (!trigger) return
        // Add click event listener to trigger
        trigger.addEventListener("click", () => {
          // If allowMultiple is true, toggle the active class
          if (this.config.allowMultiple) {
            item.classList.toggle("active")
            return
          }
          // If allowMultiple is false, remove active class from all items except the clicked one
          items.forEach((el, j) => {
            if (i === j) {
              el.classList.toggle("active")
            } else {
              el.classList.remove("active")
            }
          })
        })
      })
    })
  }
}

customElements.define("ui-accordion", AccordionElement)

export { AccordionElement }
