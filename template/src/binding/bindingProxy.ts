type ProxyWithCreateIter<T> = T extends (infer U)[]
  ? ProxyWithCreateIter<U>[]
  & {
    bindIter: (tag?: string) => ProxyWithCreateIter<U>;
  }
  : T extends object
  ? {
    [K in keyof T]: ProxyWithCreateIter<T[K]>;
  }
  : T;

// This code is included to prevent unnecessary creation of 'it_xxxxxxxx' strings on each call of bindForIterNameGenerator.
// A single string is sufficient as it will generate a new one when the .replace function is used.
const iteratorTemplateString = 'it_xxxxxxxx';

function bindForIterNameGenerator() {
  return iteratorTemplateString
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

let scheduledUpdate = false;

/*
The base path stores the path to the object property. For example, accessing test.test2.test3 will set the base path to "test.test2.test3",
allowing us to later return that string in the "{{test.test2.test3}}" format.

The root is used to preserve the current object/array when accessing a nested property. For instance, when accessing test.test2.test3, it will save the actual reference to that object.

The mainModel is used to save a reference to the real data binding model that is bound with the proxy object. For example, if we have two models in our .json file:
{
  test: {},
  test2: {},
}

a proxy will be created for both test and test2, preserving the main model reference for each. The mainModel is used when setting a nested property in the model,
ensuring that the created mock model is updated properly with the reference of the mainModel.
For example, setting test.test = 1 will call the setter in the proxy and will execute engine.updateWholeModel(test) instead of engine.updateWholeModel(test.test2). This guarantees that
the mainModel will always be test when setting a property.

Additionally, since we can have multiple models defined in our JSON file and we create a proxy for the entire JSON object, the first main object should be null as we will work with the internal properties of the JSON model object.
This is why we check if mainModel === null.
*/
export function createBindingProxy<T>(basePath: string = "", root: any = {}, mainModel: object | null = null): ProxyWithCreateIter<T> {
  // This code handles the case when you try to access a deeply nested primitive value, such as player[0].weapons[0].name.
  // If this is the case, the code will enter here and will not create a new proxy.
  if (typeof root !== 'object') {
    return root;
  }

  return new Proxy(root, {
    get(target, prop: string | symbol) {
      if (typeof prop === "symbol") {
        if (prop === Symbol.toStringTag) {
          return "BindingProxy";
        }
        return undefined;
      }

      if (prop === "toString" || prop === "valueOf") {
        return () => `{{${basePath}}}`;
      }

      if (prop === "bindIter") {
        // We create a new proxy with a new base path that is the iterator name. This ensures that when the object is called in the HTML, it will return {{iter}} instead of {{test.test}}.
        // Additionally, the tag parameter is used to overwrite the default hash iterator name that is generated. Instead of {{it_1234}}, it will be {{tag}} in the HTML attribute.
        return (tag?: string) => createBindingProxy(tag || bindForIterNameGenerator(), root, mainModel === null ? root : mainModel);
      }

      const isIndex = !isNaN(Number(prop));
      const path = basePath
        ? isIndex
          ? `${basePath}[${prop}]`
          : `${basePath}.${prop}`
        : `${prop}`;

      const nextTarget = isIndex ? (root as any)[prop] : root[prop as keyof typeof root];

      if (typeof nextTarget === "object" && nextTarget !== null) {
        return createBindingProxy(path, nextTarget, mainModel === null ? nextTarget : mainModel);
      }

      return createBindingProxy(path, nextTarget, mainModel);
    },

    set(target, prop: string | symbol, newValue) {
      if (mainModel === null) return false;
      if (typeof prop === "symbol") {
        throw new TypeError("Cannot set a value to a symbol property");
      }

      (target as any)[prop] = newValue;

      engine.updateWholeModel(mainModel as object);

      // batch update models on the next frames. Otherwise making
      // test.test = 1;
      // test.test2 = 2;
      // Will execute engine.synchronizeModels() two times and decrease the performance.
      if (scheduledUpdate) return true;

      window.requestAnimationFrame(() => {
        engine.synchronizeModels();
        scheduledUpdate = false;
      });

      scheduledUpdate = true;

      return true;
    },
  }) as ProxyWithCreateIter<T>;
}
