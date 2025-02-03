import type { Plugin } from 'vite';
import { parseDocument } from "htmlparser2";
import { default as serialize } from "dom-serializer";

export interface GamefacePluginOptions { }

export default function (options: GamefacePluginOptions = {}): Plugin {
    return {
        name: 'gameface',
        transform(code, id) {
            const isSVG = id.endsWith('.svg?component-solid');

            if (isSVG || id.endsWith('.tsx')) {
                const template = code.match(/_\$template\(`(.*?)`\);/);
                if (!template || !template[0] || !template[1]) return code;

                const templateString = isSVG ? template[1].replace(/=\s*([^"'\s>]+)/g, '="$1"') : template[1];
                const doc = parseDocument(templateString, { lowerCaseTags: false });
                const begin = code.substring(0, template.index!);
                const end = code.substring(template.index! + template[0].length, code.length);

                code = begin + `_$template(\`${serialize(doc)}\`);` + end;

                return code;
            }
        }
    }
}