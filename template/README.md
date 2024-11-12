# Gameface UI project template

## Creating a view

To create a new view, follow the structure of `src/views/hud` or `src/views/menu`. Start by making a new folder `src/views/${viewName}`, and within it, include `index.html`, `index.tsx`, `index.css`, and `${viewName}.tsx` files.

## Build & run the project in production

To create a production build, run `npm run build` from this folder. This will generate a production build within the `dist` directory.

Each view located in `src/views` will be built into `dist/${viewName}`. For instance, `src/views/hud` will be built in `dist/hud`.

To run the project, open the specific view by loading the `index.html` in the corresponding `dist/${viewName}` directory. For example, to load the hud view, open `dist/hud/index.html`.

## Run in development

To start the project in development mode, run `npm run dev` from this folder. This will start a server on `localhost:${port}`, typically on port `3000`.

To view a specific page during development, navigate to the following URL, for example: `http://localhost:3000/hud/` to load the hud view.

With the development server running, HOT module replacement will be enabled, so any changes you make will immediately be reflected.
