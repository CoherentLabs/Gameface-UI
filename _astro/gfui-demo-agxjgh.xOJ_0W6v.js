import { g as getNextElement, H as spread, A as runHydrationEvents, t as template, y as delegateEvents, f as createMemo, x as addEventListener, i as insert, c as createComponent, n as createRenderEffect, p as className, s as style, a as createSignal, K as Switch, M as Match, r as render } from './web.bikURqO-.js';
import { s as styles$1, I as Input, A as After, B as Before, a as InputBase, b as InputWrapper } from './TextInput.module.BailTvmT.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.ChN_WbXL.js';
import { u as useTextInput, A as AddonSlot } from './AddonSlot.B3KtVx5g.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';

var _tmpl$$2 = /*#__PURE__*/template(`<svg fill=#FFFFFF width=100% height=100% viewBox="0 0 24 24"><g><g><rect width=24 height=24 opacity=0></rect><path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zM12.22 17c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z"></path><path d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z">`);
const EyeIcon = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$2);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$1 = /*#__PURE__*/template(`<svg fill=#FFFFFF width=100% height=100% viewBox="0 0 512 512"><path d=M432,448a15.92,15.92,0,0,1-11.31-4.69l-352-352A16,16,0,0,1,91.31,68.69l352,352A16,16,0,0,1,432,448Z></path><path d=M255.66,384c-41.49,0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91l0-.08c19.94-28.57,41.78-52.73,65.24-72.21a2,2,0,0,0,.14-2.94L93.5,161.38a2,2,0,0,0-2.71-.12c-24.92,21-48.05,46.76-69.08,76.92a31.92,31.92,0,0,0-.64,35.54c26.41,41.33,60.4,76.14,98.28,100.65C162,402,207.9,416,255.66,416a239.13,239.13,0,0,0,75.8-12.58,2,2,0,0,0,.77-3.31l-21.58-21.58a4,4,0,0,0-3.83-1A204.8,204.8,0,0,1,255.66,384Z></path><path d=M490.84,238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349,110.55,302,96,255.66,96a227.34,227.34,0,0,0-74.89,12.83,2,2,0,0,0-.75,3.31l21.55,21.55a4,4,0,0,0,3.88,1A192.82,192.82,0,0,1,255.66,128c40.69,0,80.58,12.43,118.55,37,34.71,22.4,65.74,53.88,89.76,91a.13.13,0,0,1,0,.16,310.72,310.72,0,0,1-64.12,72.73,2,2,0,0,0-.15,2.95l19.9,19.89a2,2,0,0,0,2.7.13,343.49,343.49,0,0,0,68.64-78.48A32.2,32.2,0,0,0,490.84,238.6Z></path><path d=M256,160a95.88,95.88,0,0,0-21.37,2.4,2,2,0,0,0-1,3.38L346.22,278.34a2,2,0,0,0,3.38-1A96,96,0,0,0,256,160Z></path><path d=M165.78,233.66a2,2,0,0,0-3.38,1,96,96,0,0,0,115,115,2,2,0,0,0,1-3.38Z>`);
const EyeOffIcon = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$1);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

const styles = {
	"visibility-button": "_visibility-button_1rzja_1"
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const VisibilityButton = createTokenComponent();
const VisibilityButtonComponent = (props) => {
  const VisibilityButtonToken = useToken(VisibilityButton, props.parentChildren);
  const VisibilityButtonClasses = createMemo(() => {
    const classes = [styles["visibility-button"]];
    classes.push(VisibilityButtonToken()?.position === "before" ? styles$1.before : styles$1.after);
    classes.push(VisibilityButtonToken()?.class ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    addEventListener(_el$, "click", props.toggle, true);
    insert(_el$, () => VisibilityButtonToken()?.children || (props.visible() ? createComponent(EyeIcon, {}) : createComponent(EyeOffIcon, {})));
    createRenderEffect((_p$) => {
      var _v$ = VisibilityButtonClasses(), _v$2 = VisibilityButtonToken()?.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

const PasswordInput = (props) => {
  const BeforeToken = useToken(Before, props.children);
  const AfterToken = useToken(After, props.children);
  const VisibilityButtonToken = useToken(VisibilityButton, props.children);
  const {
    value,
    handleChange,
    changeValue,
    clear
  } = useTextInput(props);
  const [type, setType] = createSignal("password");
  const visible = createMemo(() => type() !== "password");
  const toggleVisibility = () => {
    if (type() === "password") show();
    else hide();
  };
  const show = () => {
    setType("text");
  };
  const hide = () => {
    setType("password");
  };
  const visibilityPosition = createMemo(() => VisibilityButtonToken()?.position ?? "after");
  const isBefore = createMemo(() => !!VisibilityButtonToken() && visibilityPosition() === "before");
  const isAfter = createMemo(() => !!VisibilityButtonToken() && visibilityPosition() === "after");
  const inputRef = {
    current: void 0
  };
  const refObject = {
    value,
    changeValue,
    visible,
    clear,
    show,
    hide
  };
  return createComponent(InputWrapper, {
    props,
    inputRef,
    refObject,
    get children() {
      return [createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return isBefore();
            },
            get children() {
              return createComponent(VisibilityButtonComponent, {
                visible,
                toggle: toggleVisibility,
                get parentChildren() {
                  return props.children;
                }
              });
            }
          }), createComponent(Match, {
            get when() {
              return !isBefore();
            },
            get children() {
              return createComponent(AddonSlot, {
                token: BeforeToken,
                get className() {
                  return styles$1.Before;
                }
              });
            }
          })];
        }
      }), createComponent(InputBase, {
        get type() {
          return type();
        },
        value,
        ref: (el) => inputRef.current = el,
        handleChange,
        get parentChildren() {
          return props.children;
        },
        get hasBefore() {
          return isBefore() || !!BeforeToken();
        },
        get hasAfter() {
          return isAfter() || !!AfterToken();
        }
      }), createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return isAfter();
            },
            get children() {
              return createComponent(VisibilityButtonComponent, {
                visible,
                toggle: toggleVisibility,
                get parentChildren() {
                  return props.children;
                }
              });
            }
          }), createComponent(Match, {
            get when() {
              return !isAfter();
            },
            get children() {
              return createComponent(AddonSlot, {
                token: AfterToken,
                get className() {
                  return styles$1.After;
                }
              });
            }
          })];
        }
      })];
    }
  });
};
const PasswordInput$1 = Object.assign(PasswordInput, {
  Before,
  After,
  Input,
  VisibilityButton
});

const agxjgh = (root) => render(() => createComponent(PasswordInput$1, {}), root);

export { agxjgh as default };
