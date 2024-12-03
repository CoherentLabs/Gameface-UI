import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Transform.module.css'
import LayoutBaseProps from "../../types/LayoutBase";
import { Matrix } from "rematrix";

interface TransformMethods {
    skew?: { x?: number; y?: number; };
    translate?: { x?: number; y?: number; z?: number };
    rotate?: { x?: number; y?: number; z?: number };
    scale?: { x?: number; y?: number; z?: number };
}

type vertical = 'top' | 'center' | 'bottom';
type horizontal = 'left' | 'center' | 'right';

interface Transform extends LayoutBaseProps, TransformMethods {
    matrix?: TransformMethods
    origin?: vertical | horizontal | `${vertical} ${horizontal}` | {x: string, y: string};
}

function getUnit(transform: string) {
    if(transform === 'skew' || transform === 'rotate') return 'deg'
    else if(transform === 'translate') return 'px'
    else return ''
}

function getTransformString(transformObject: Record<string, number | undefined>, transformKey: string) {
    let transformString = "";
    let unit = getUnit(transformKey);

    for (const axis in transformObject) { 
        const value = transformObject[axis];
        transformString += ` ${transformKey}${axis.toUpperCase()}(${value}${unit})`; 
    }

    return transformString
}

function generateTransformMatrix(matrix: TransformMethods) {
    let transformString = '';

    for (const transformKey in matrix) {
        const transformObject = matrix[transformKey as keyof TransformMethods];
        if (transformObject) {
            transformString += getTransformString(transformObject as Record<string, number>, transformKey);
        }
    }

    return transformString.trim();
}

function handleTransformProps(props: TransformMethods & { matrix?: TransformMethods }) {
    if(props.matrix) return generateTransformMatrix(props.matrix);
    else {
        if(props.translate) return getTransformString(props.translate, 'translate');
        else if(props.rotate) return getTransformString(props.rotate, 'rotate');
        else if(props.skew) return getTransformString(props.skew, 'skew');
        else if(props.scale) return getTransformString(props.scale, 'scale');
    }
}

function getTransformOrigin(origin: Transform['origin']) {
    return typeof origin === 'string'
        ? origin
        : origin && typeof origin === 'object'
        ? `${origin.x} ${origin.y}`
        : ''; 
}

const Transform: ParentComponent<Transform> = (props) => {
    const transformString = handleTransformProps(props);
    const transformOrigin = getTransformOrigin(props.origin)
        
    const transformStyles = {
        transform: transformString,
        "transform-origin": transformOrigin
    } 

    return <LayoutBase {...props} componentStyles={transformStyles} componentClasses={styles.Transform} />
}

export default Transform