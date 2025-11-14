declare module '*.module.css' 

// Remove when scrollTop fix is applied
declare global {
  interface HTMLElementEventMap {
    'property-scroll': CustomEvent;
  }
}

export {};