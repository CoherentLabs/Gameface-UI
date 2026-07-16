import { L as LayoutBase } from './LayoutBase.DEk-c953.js';
import { c as createComponent, m as mergeProps } from './web.ibFHgs_k.js';

const row = "_row_1t3gs_1";
const styles$1 = {
	row: row
};

const Row = (props) => {
  return createComponent(LayoutBase, mergeProps(props, {
    get componentClasses() {
      return styles$1.row;
    }
  }));
};

const styles = {
	"column-1": "_column-1_1ilnm_1",
	"column-2": "_column-2_1ilnm_5",
	"column-3": "_column-3_1ilnm_9",
	"column-4": "_column-4_1ilnm_13",
	"column-5": "_column-5_1ilnm_17",
	"column-6": "_column-6_1ilnm_21",
	"column-7": "_column-7_1ilnm_25",
	"column-8": "_column-8_1ilnm_29",
	"column-9": "_column-9_1ilnm_33",
	"column-10": "_column-10_1ilnm_37",
	"column-11": "_column-11_1ilnm_41",
	"column-12": "_column-12_1ilnm_45"
};

const Columns = {};
for (let i = 1; i <= 12; i++) {
  const componentName = `Column${i}`;
  Columns[componentName] = (props) => {
    return createComponent(LayoutBase, mergeProps(props, {
      get componentClasses() {
        return styles[`column-${i}`];
      }
    }));
  };
}
const Column1 = Columns.Column1;
const Column2 = Columns.Column2;
const Column3 = Columns.Column3;
const Column4 = Columns.Column4;
const Column5 = Columns.Column5;
const Column6 = Columns.Column6;
const Column7 = Columns.Column7;
const Column8 = Columns.Column8;
const Column9 = Columns.Column9;
const Column10 = Columns.Column10;
const Column11 = Columns.Column11;
const Column12 = Columns.Column12;
const Column = Columns.Column12;
const Column$1 = Object.assign(Column, {
  "One": Column1,
  "Two": Column2,
  "Three": Column3,
  "Four": Column4,
  "Five": Column5,
  "Six": Column6,
  "Seven": Column7,
  "Eight": Column8,
  "Nine": Column9,
  "Ten": Column10,
  "Eleven": Column11,
  "Twelve": Column12
});

export { Column$1 as C, Row as R, Column2 as a, Column10 as b, Column12 as c };
