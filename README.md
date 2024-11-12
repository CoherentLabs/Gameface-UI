# Gameface UI

## Getting started

To begin using the Gameface UI, we recommend utilizing the components in the `gf-ui-components` folder and are built with [SolidJS](https://www.solidjs.com/), and setting up your project with the template located in the `template` folder.

The template provides a boilerplate project structure with [SolidJS](https://www.solidjs.com/), [Vite](https://vite.dev/) and [TypeScript](https://www.typescriptlang.org/). It includes two sample views - `hud` and `menu` - which you can preview as examples before starting your project.

### Installing the template or components

We suggest using `degit` for cloning repositories, specific folders, branches, or tags.

The next steps are showing how to get started building the project using Gameface UI:

1. Install `degit` globally with: `npm i -g degit`. Or you can simply use `npx` without installing globally the `degit` module - `npx degit`.
2. With `degit` installed, clone the template into your folder by running `degit CoherentLabs/Gameface-UI/template#master`. This will download the latest template version. To clone a specific version, replace `#master` with the desired tag, e.g., `#1.2.3`.
3. If you'd like to use `gf-ui-components` for quick prototyping and UI development:
   1. Create a folder within your project, such as `gf-ui-components`.
   2. Run `degit CoherentLabs/Gameface-UI/gf-ui-components#master` inside this folder to get the latest components. For a specific version, replace `#master` with the desired tag.

### Running the project

Once the template project is set up, install the required npm modules by running `npm i`.

Refer to the README.md in the `template` folder for more information on commands for building in production or dev environments, and start developing your UI.

### Updating the components

To update the `gf-ui-components` folder with the latest or a specific version:

1. Delete the contents of the `gf-ui-components` folder.
2. Run `degit CoherentLabs/Gameface-UI/gf-ui-components#master` to get the latest components or `degit CoherentLabs/Gameface-UI/gf-ui-components#1.2.3` for a specific version.
