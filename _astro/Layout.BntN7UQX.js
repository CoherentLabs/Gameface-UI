import { L as LayoutBase } from './LayoutBase.D9nt2oGz.js';
import { c as createComponent, m as mergeProps } from './web.e96V-LtU.js';
import { C as Content } from './Content.CtOfkS9o.js';

const layout = "_layout_1sw9u_1";
const styles$2 = {
	layout: layout
};

const top = "_top_e0szn_1";
const styles$1 = {
	top: top
};

const Top = (props) => {
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles$1.top;
    },
    get componentStyles() {
      return {
        "flex-basis": props.basis ? `${props.basis}%` : ""
      };
    }
  }));
};

const bottom = "_bottom_1bj4s_1";
const styles = {
	bottom: bottom
};

const Bottom = (props) => {
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles.bottom;
    },
    get componentStyles() {
      return {
        "flex-basis": props.basis ? `${props.basis}%` : ""
      };
    }
  }));
};

const Layout = (props) => {
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles$2.layout;
    }
  }));
};
const Layout$1 = Object.assign(Layout, {
  Top,
  Bottom,
  Content
});

export { Bottom as B, Layout$1 as L, Top as T };
