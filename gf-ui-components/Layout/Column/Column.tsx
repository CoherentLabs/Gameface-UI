import { JSX  } from "solid-js";
import styles from './Column.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

const Columns: Record<string, (props: LayoutBaseProps) => JSX.Element> = {};

for (let i = 1; i <= 12; i++) {
  const componentName = `Column${i}`;

  Columns[componentName] = (props: LayoutBaseProps) => {
    return <LayoutBase {...props} componentClasses={styles[`Column-${i}`]}/>
  };
}

export const Column1 = Columns.Column1;
export const Column2 = Columns.Column2;
export const Column3 = Columns.Column3;
export const Column4 = Columns.Column4;
export const Column5 = Columns.Column5;
export const Column6 = Columns.Column6;
export const Column7 = Columns.Column7;
export const Column8 = Columns.Column8;
export const Column9 = Columns.Column9;
export const Column10 = Columns.Column10;
export const Column11 = Columns.Column11;
export const Column12 = Columns.Column12;
export const Column = Columns.Column12;