import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentComponent  } from "solid-js";
import styles from './Layout.module.css';

const Layout: ParentComponent = (props) => {
    return (
        <div>{props.children}</div>
    )
}

export default Layout;