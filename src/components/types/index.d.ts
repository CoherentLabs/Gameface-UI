import { Property } from "csstype";
import { Accessor } from "solid-js";

declare module '*.module.css'

// Remove when scrollTop fix is applied
declare global {
  interface HTMLElementEventMap {
    'property-scroll': CustomEvent;
  }
}

export type TypedOMUnit =
  | 'px'
  | 'percent' // CSS Typed OM uses 'percent', not '%'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax'
  | 'em'
  | 'rem'
  | 'in'
  | 'pt'
  | 'deg'
  | 'ms'
  | 'number' // Used for unitless values, e.g., new CSSUnitValue(1, 'number')
  | 's';

export type TypedOMLengthUnit = 'px' | 'em' | 'rem' | 'pt' | 'percent' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'in';

export type NumericCSSProperty<UnitType extends TypedOMLengthUnit = TypedOMLengthUnit> = { value: Accessor<number> | number; unit: UnitType };

export type TransformStyle = {
  translateX: NumericCSSProperty;
  translateY: NumericCSSProperty;
  scaleX: Accessor<number> | number;
  scaleY: Accessor<number> | number;
  rotate: Accessor<number> | number;
  // Optional - most transforms don't skew. Degrees, defaults to 0 when absent.
  skewX?: Accessor<number> | number;
  skewY?: Accessor<number> | number;
};

declare module "solid-js" {
  namespace JSX {
    interface CSSProperties {
      "border-top-width"?: Property.BorderTopWidth | NumericCSSProperty;
      "border-bottom-width"?: Property.BorderBottomWidth | NumericCSSProperty;
      "border-left-width"?: Property.BorderLeftWidth | NumericCSSProperty;
      "border-right-width"?: Property.BorderRightWidth | NumericCSSProperty;
      "bottom"?: Property.Bottom | NumericCSSProperty;
      "top"?: Property.Top | NumericCSSProperty;
      "left"?: Property.Left | NumericCSSProperty;
      "right"?: Property.Right | NumericCSSProperty;
      "width"?: Property.Width | NumericCSSProperty;
      "height"?: Property.Height | NumericCSSProperty;
      "margin-top"?: Property.MarginTop | NumericCSSProperty;
      "margin-bottom"?: Property.MarginBottom | NumericCSSProperty;
      "margin-left"?: Property.MarginLeft | NumericCSSProperty;
      "margin-right"?: Property.MarginRight | NumericCSSProperty;
      "flex-basis"?: Property.FlexBasis | NumericCSSProperty;
      "flex-grow"?: Property.FlexGrow | NumericCSSProperty;
      "flex-shrink"?: Property.FlexShrink | NumericCSSProperty;
      "font-size"?: Property.FontSize | NumericCSSProperty;
      "letter-spacing"?: Property.LetterSpacing | NumericCSSProperty;
      "line-height"?: Property.LineHeight | NumericCSSProperty;
      "max-width"?: Property.MaxWidth | NumericCSSProperty;
      "max-height"?: Property.MaxHeight | NumericCSSProperty;
      "min-width"?: Property.MinWidth | NumericCSSProperty;
      "min-height"?: Property.MinHeight | NumericCSSProperty;
      "padding-top"?: Property.PaddingTop | NumericCSSProperty;
      "padding-bottom"?: Property.PaddingBottom | NumericCSSProperty;
      "padding-left"?: Property.PaddingLeft | NumericCSSProperty;
      "padding-right"?: Property.PaddingRight | NumericCSSProperty;
      "text-decoration-thickness"?: Property.TextDecorationThickness | NumericCSSProperty;
      "text-stroke-width"?: Property.WebkitTextStrokeWidth | NumericCSSProperty;
      "text-underline-offset"?: Property.TextUnderlineOffset | NumericCSSProperty;
      "transform"?: Property.Transform | TransformStyle;
    }
  }
}

export { };