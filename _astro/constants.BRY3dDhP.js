import { q as delegateEvents, b as createMemo, g as getNextElement, y as getNextMarker, B as addEventListener, u as use, i as insert, c as createComponent, n as createRenderEffect, p as className, s as style, A as memo, z as Show, E as setAttribute, L as setProperty, w as runHydrationEvents, t as template, o as onMount } from './web.DT9QqbDn.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.D7hEHUQ6.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import { u as useNavigation, n as navigationActions, b as baseComponent } from './BaseComponent.dZiros1M.js';

const Input = createTokenComponent();
const Placeholder = createTokenComponent();
const Before = createTokenComponent();
const After = createTokenComponent();

const input = "_input_11qet_1";
const disabled = "_disabled_11qet_42";
const placeholder = "_placeholder_11qet_47";
const baseStyles = {
	input: input,
	"input-wrapper": "_input-wrapper_11qet_10",
	"input-element-wrapper": "_input-element-wrapper_11qet_26",
	"has-before": "_has-before_11qet_33",
	"has-after": "_has-after_11qet_37",
	disabled: disabled,
	placeholder: placeholder
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`), _tmpl$2 = /* @__PURE__ */ template(`<div><input><!$><!/>`);
const InputBase = (props) => {
  const InputToken = useToken(Input, props.parentChildren);
  const PlaceholderToken = useToken(Placeholder, props.parentChildren);
  const InputClasses = createMemo(() => {
    const classes = [baseStyles.input];
    if (props.hasBefore) classes.push(baseStyles["has-before"]);
    if (props.hasAfter) classes.push(baseStyles["has-after"]);
    classes.push(InputToken()?.class ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$2 = _el$.firstChild, _el$4 = _el$2.nextSibling, [_el$5, _co$] = getNextMarker(_el$4.nextSibling);
    _el$2.$$dblclick = (e) => e.currentTarget.select();
    addEventListener(_el$2, "input", props.handleChange, true);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : props.ref = _el$2;
    insert(_el$, createComponent(Show, {
      get when() {
        return memo(() => !!PlaceholderToken())() && props.value() === "";
      },
      get children() {
        var _el$3 = getNextElement(_tmpl$$1);
        insert(_el$3, () => PlaceholderToken()?.children || "");
        createRenderEffect((_p$) => {
          var _v$ = `${baseStyles.placeholder} ${PlaceholderToken()?.class ?? ""}`, _v$2 = PlaceholderToken()?.style;
          _v$ !== _p$.e && className(_el$3, _p$.e = _v$);
          _p$.t = style(_el$3, _v$2, _p$.t);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$3;
      }
    }), _el$5, _co$);
    createRenderEffect((_p$) => {
      var _v$3 = baseStyles["input-element-wrapper"], _v$4 = props.type, _v$5 = InputClasses(), _v$6 = InputToken()?.style;
      _v$3 !== _p$.e && className(_el$, _p$.e = _v$3);
      _v$4 !== _p$.t && setAttribute(_el$2, "type", _p$.t = _v$4);
      _v$5 !== _p$.a && className(_el$2, _p$.a = _v$5);
      _p$.o = style(_el$2, _v$6, _p$.o);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    createRenderEffect(() => setProperty(_el$2, "value", props.value()));
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["input", "dblclick"]);

const before = "_before_1jo3j_1";
const after = "_after_1jo3j_1";
const styles = {
	before: before,
	after: after
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const InputWrapper = (wrapperProps) => {
  let element;
  const nav = useNavigation();
  const inputWrapperClasses = createMemo(() => {
    const classes = [baseStyles["input-wrapper"]];
    if (wrapperProps.props.disabled) {
      classes.push(baseStyles.disabled);
      if (wrapperProps.props["class-disabled"]) {
        classes.push(wrapperProps.props["class-disabled"]);
      }
    }
    return classes.join(" ");
  });
  onMount(() => {
    if (!wrapperProps.props.ref || !element) return;
    wrapperProps.props.ref({
      element,
      input: wrapperProps.inputRef.current,
      ...wrapperProps.refObject
    });
  });
  wrapperProps.props.componentClasses = () => inputWrapperClasses();
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    use(navigationActions, _el$, () => mergeNavigationActions(wrapperProps.props, {
      "select": () => {
        nav?.pauseNavigation();
        wrapperProps.inputRef.current?.focus();
      },
      "back": () => {
        nav?.resumeNavigation();
        wrapperProps.inputRef.current?.blur();
      },
      ...wrapperProps.navActions
    }));
    use(baseComponent, _el$, () => wrapperProps.props);
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$, () => wrapperProps.children);
    return _el$;
  })();
};

const debounce = (func, wait) => {
  let timeout;
  const debounced = function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = void 0;
  };
  return debounced;
};

const DEFAULT_DELAY = 250;

export { After as A, Before as B, DEFAULT_DELAY as D, Input as I, Placeholder as P, InputBase as a, InputWrapper as b, debounce as d, styles as s };
