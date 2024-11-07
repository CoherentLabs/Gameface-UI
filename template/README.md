# Gameface UI project template

## Creating a view

To create a new view you can follow the structure of `src/views/hud` or `src/views/menu`. You need to create a new folder `src/views/${viewName}` that includes `index.html`, `index.tsx`, `index.css` and the `${viewName}.tsx` files.

## Build & run the project in production

To build the project in production execute the `npm run build` command in this folder and it will generate production build inside the `dist` folder.

Each view from the `src/views` folder will be build upon `dist/${viewName}`. For example `src/views/hud` will be build inside `dist/hud`.

To run the project you can simply load a view you can load the `index.html` for that view built in the `dist/${viewName}` folder. So if I want to load the hud view I can simply load the `dist/hud/index.html` page.

## Run in development

To run the project in development mode you can execute the `npm run dev` command inside this folder. The command will start a server on `localhost:${port}` where the port usually is `3000`.

After that to load a view in development you can simply use the following url - `http://localhost:3000/hud/` as an example to load the hud view.

What is more while your development server is running you will have HOT module replacement enabled and each change you do on the view will be instantly loaded.
