// `solid/no-unknown-namespaces`, except that `attr:*` on components is allowed.
//
// The original rule reports every namespaced prop on a component ("Namespaced props have no effect on
// components"), with no option to change that. In Gameface UI `attr:*` on a component does have an effect:
// BaseComponent applies it to the component's root element (`handleAttrs`), so users can set any attribute
// (`<Block attr:id="x">`). Everything else the rule checks is kept, including the Solid 2 warning for
// `attr:` / `on:` / `use:` on native elements, where they really are broken.
import solid from 'eslint-plugin-solid';

const rule = solid.rules['no-unknown-namespaces'];

export default {
    meta: rule.meta,
    create(context) {
        const filtered = Object.create(context, {
            report: {
                value(descriptor) {
                    const isAttrOnComponent = descriptor.messageId === 'component' && descriptor.node?.namespace?.name === 'attr';
                    if (!isAttrOnComponent) context.report(descriptor);
                },
            },
        });
        return rule.create(filtered);
    },
};
