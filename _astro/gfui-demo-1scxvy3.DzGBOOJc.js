import { c as createComponent, m as mergeProps, r as render } from './web.ibFHgs_k.js';
import { L as LayoutBase } from './LayoutBase.DEk-c953.js';
import { T as Transform } from './Transform.Bp0iaNVW.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

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
