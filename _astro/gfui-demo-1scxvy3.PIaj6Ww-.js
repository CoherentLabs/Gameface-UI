import { c as createComponent, m as mergeProps, r as render } from './web.bikURqO-.js';
import { L as LayoutBase } from './LayoutBase.Crrr9d-c.js';
import { T as Transform } from './Transform.BzPSP2HM.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';

const layout3D = "_layout3D_1dobg_1";
const styles = {
	layout3D: layout3D
};

const Layout3D = (props) => {
  return createComponent(LayoutBase, mergeProps({
    get componentStyles() {
      return {
        perspective: `${props.distance}`
      };
    }
  }, props, {
    get componentClasses() {
      return styles.layout3D;
    }
  }));
};

const _1scxvy3 = (root) => render(() => createComponent(Layout3D, {
  distance: "1000px",
  get children() {
    return createComponent(Transform, {
      matrix: {
        rotate: {
          y: 60
        },
        scale: {
          x: 2,
          z: 2
        }
      },
      children: "Element rotated by 60° on the y-axis. "
    });
  }
}), root);

export { _1scxvy3 as default };
