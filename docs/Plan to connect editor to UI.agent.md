Plan to connect editor to UI

1. Project initialization:

1.1. Open a folder in the Tauri Adapter and read the file structure. [Done]
1.2. Check package.json if solid-js is a dependency. []
1.3. If solid-js is a dependency, check if project is GamefaceUI or a different solid-js project. []

1.4. If GamefaceUI, run `npm run dev` to start the development server. []
1.5. Get stdout from the dev server process and get the URL where the app is running. []
1.6. Save URL in the editorStore. []

2. Vite plugin for connecting to the editor:
2.1. When run it should scan the contents of the project for the following:
- Assets: ./src/assets
- Components: ./src/components
- Custom Components: ./src/custom-components
- Pages: ./src/views

2.2 Get the corresponding file paths for each of these and save them in the editorStore. []
- For assets we look for:
-- Images: .jpg, .jpeg, .png, .svg and .webp files.
-- Fonts: .ttf and .otf files.
-- Videos: .webm
- For components we look for .tsx files and corresponding manifest.json file that describes the component's props and metadata.
- For custom components we look for .tsx files and corresponding manifest.json file that describes the component's props and metadata. If no manifest.json file is found, we create a default one with basic metadata and no props.
- For pages we look for PascalCase .tsx files 

2.3. Plugin listens for custom websocket events from the editor []
- `coherent:editor:request_pages`: when received, plugin responds with the list of pages and their file paths. []
- `coherent:editor:request_components`: when received, plugin responds with the list of components and their file paths. []
- `coherent:editor:request_custom_components`: when received, plugin responds with the list of custom components and their file paths. []
- `coherent:editor:request_assets`: when received, plugin responds with the list of assets and their file paths. []
- `coherent:editor:inject_code`: receives code to inject into a specific page or component file, along with the file path and injection strategy (e.g. insert at top, insert at bottom, replace content). Plugin performs the code injection at runtime and responds with success or error status. []
- `coherent:editor:inject_style`: receives CSS code to inject into the project, along with the injection strategy (e.g. insert in head, insert in body). Plugin performs the style injection at runtime and responds with success or error status. []
- `coherent:editor:save_file`: receives a file path and content to save. Plugin writes the content to the specified file path and responds with success or error status. []
- `coherent:editor:create_file`: receives a file path and content to create. Plugin creates a new file at the specified path with the given content and responds with success or error status. []
- `coherent:editor:delete_file`: receives a file path to delete. Plugin deletes the specified file and responds with success or error status. []
- `coherent:editor:rename_file`: receives an old file path and a new file path. Plugin renames the specified file and responds with success or error status. []
- `coherent:editor:read_file`: receives a file path to read. Plugin reads the content of the specified file and responds with the content in a nodemap format or an error status. []

2.4. Plugin emits websocket events:
- `coherent:vite:page_updated`: emitted when a page file is updated, with the file path and updated content. []
- `coherent:vite:component_updated`: emitted when a component file is updated, with the file path and updated content. []
- `coherent:vite:custom_component_updated`: emitted when a custom component file is updated, with the file path and updated content. []
- `coherent:vite:asset_updated`: emitted when an asset file is updated, with the file path and updated content. []
- `coherent:vite:send_data`: emitted when the plugin wants to send data to the editor, like asset names, components, pages and custom components with a payload containing the data. []
- `coherent:vite:toast`: emitted when the plugin wants to show a toast notification in the editor, with a payload containing the type (success, error, info) and message. []
- `coherent:vite:node_data`: emitted when the plugin wants to send nodemap data to the editor, with a payload containing the nodemap, root node id and file name []

2.5. Plugin adds ids to the elements in the page and component files to enable tracking and mapping between the editor and the codebase. []
- It creates a `data-editor-id` attribute for each element and assigns a unique id. []
- For JSX Components, it wraps them in a div with a `display: contents` style and assigns the `data-editor-id` to that div to preserve the mapping without affecting the layout. We also add an attribute `isComponent` so whenever we send events to the injected script it will apply them to the first child element  []

2.6 Add parseJsx and compileJsx functions to convert JSX code to a nodemap format and back, enabling the editor to understand the structure of the code and make targeted updates. [~]
- `parseJsx`: takes JSX code as input and returns a nodemap representation of the code, along with the root node id and any imports, reactive variables, custom code blocks, custom methods and interfaces found in the code. []
- `compileJsx`: takes a nodemap, root node id and additional metadata as input and returns the corresponding JSX code, allowing the editor to send updates in a nodemap format and have them reflected in the actual codebase. []

2.7. Editor checks which browser the app is running in, if it's not the Tauri webview it stops the plugin and doesn't receive any data from it. []

3. Editor integration: 

3.1. When the editor receives the list of pages, components, custom components and assets from the plugin, it displays them in the UI and allows the user to select one to work on. []
3.2. When the user selects a page or component, the editor requests the content of that file from the plugin and displays it in a code editor. []
3.3. When the user makes changes to the style properties of an element in the editor, the editor sends a request to the plugin to trigger the injected script events that update the corresponding element in the running app with the new styles. []
3.4. When the user makes changes to the structure of the page or component (e.g. adding, deleting or rearranging elements), the editor sends a request to the plugin to save the file and trigger a HMR []
3.5. When user makes changes to the code in the code editor, the editor sends a request to the plugin to save the file and trigger a HMR []
3.6. When the user previews an animation, the editor sends a request to the plugin to trigger the corresponding animation in the running app. []
3.7. When the user creates a new page, component, custom component or asset, the editor sends a request to the plugin to create the corresponding file and update the UI with the new item. []
3.8. When the user deletes a page, component, custom component or asset, the editor sends a request to the plugin to delete the corresponding file and update the UI to remove the item. []
3.9. When the user renames a page, component, custom component or asset, the editor sends a request to the plugin to rename the corresponding file and update the UI with the new name. []
3.10. Create the necessary code that we need to inject into the running app to enable the real-time updates and interactions between the editor and the app. []
- This includes adding event listeners for the custom events emitted by the plugin and updating the DOM accordingly. []
- We also need to handle the mapping between the editor ids and the actual elements in the DOM to ensure that updates are applied to the correct elements. []
- We add a reset CSS to preview the styles to match the ones in Gameface. []