import { P as Placeholder, I as Input, A as After, B as Before, s as styles, a as InputBase, b as InputWrapper } from './TextInput.module.BailTvmT.js';
import { u as useToken } from './tokenComponents.ChN_WbXL.js';
import { u as useTextInput, A as AddonSlot } from './AddonSlot.B3KtVx5g.js';
import { c as createComponent } from './web.bikURqO-.js';

const TextInput = (props) => {
  const BeforeToken = useToken(Before, props.children);
  const AfterToken = useToken(After, props.children);
  const {
    value,
    handleChange,
    changeValue,
    clear
  } = useTextInput(props);
  const inputRef = {
    current: void 0
  };
  const refObject = {
    value,
    changeValue,
    clear
  };
  return createComponent(InputWrapper, {
    props,
    inputRef,
    refObject,
    get children() {
      return [createComponent(AddonSlot, {
        token: BeforeToken,
        get className() {
          return styles.before;
        }
      }), createComponent(InputBase, {
        type: "text",
        value,
        ref: (el) => inputRef.current = el,
        handleChange,
        get parentChildren() {
          return props.children;
        },
        get hasBefore() {
          return !!BeforeToken();
        },
        get hasAfter() {
          return !!AfterToken();
        }
      }), createComponent(AddonSlot, {
        token: AfterToken,
        get className() {
          return styles.after;
        }
      })];
    }
  });
};
const TextInput$1 = Object.assign(TextInput, {
  Before,
  After,
  Input,
  Placeholder
});

export { TextInput$1 as T };
