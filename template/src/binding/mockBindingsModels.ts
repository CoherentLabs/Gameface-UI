import './cohtml.js';

export default async function (models: object, callback: Function, runningInGame: boolean = false) {
    engine.whenReady.then(() => {
        if (runningInGame) return callback();

        for (const key in models) {
            engine.createJSModel(key, models[key as keyof typeof models]);
        }

        callback();
        engine.synchronizeModels();
    });
}

