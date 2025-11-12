import { onMount } from "solid-js/types/server/reactive.js"

const DraggableVariant = () => {
    return (
        <>
            {/* Makes the square draggable */}
            <Draggable>
                <div class="square"></div>
            </Draggable>

            {/* With restrictions */}
            <Draggable bounds="selector or ref">
                <div class="square"></div>
            </Draggable>
            {/* OR */}
            <Draggable>
                <div class="square-parent">
                    <Draggable.Element>
                        <div class="square"></div>
                    </Draggable.Element>
                </div>
            </Draggable>

            <Draggable bounds="selector or ref">
                <div class="square"></div>
            </Draggable>

            {/* With props - dragableOptions */}
            <Draggable 
                bounds="container" 
                lock="x"
                dragClass="dragging"
                onDragStart={() => console.log('start')} 
                onDragMove={() => console.log('move')} 
                onDragEnd={() => console.log('end')}>
                <div class="square"></div>
            </Draggable>

            {/* Programatic - internally with the actions */}
            <button onClick={() => draggableRef.move(100, 100)}>Move Square</button>
            <Draggable ref={draggableRef} bounds="selector or ref">
                <div class="square"></div>
            </Draggable>

            {/* 2 or more children -> wrap in div */}
            <Draggable bounds="selector or ref">
                <div class="square"></div>
                <div class="square"></div>
            </Draggable>
        </>
    )
}

const DropZoneVariant = () => {
    return (
        <>
            <Dropzone>
                {/* All directly nested childrne will be the drop zones */}
                <Dropzone.Target>
                    <div class="dropzone-target"></div>
                    <div class="dropzone-target"></div>
                    <div class="dropzone-target"></div>
                    <div class="dropzone-target"></div>
                </Dropzone.Target>
                {/* The element which will be draggable in the dropzone */}
                <Dropzone.Draggable>
                    <div class="square"></div>
                </Dropzone.Draggable>
            </Dropzone>

            <Dropzone>
                {/* All directly nested childrne will be the drop zones */}
                <Dropzone.Target>
                    <div class="dropzone-target"></div>
                    <div class="dropzone-target">
                        {/* The element which will be draggable in the dropzone */}
                        <Dropzone.Draggable>
                            <div class="square"></div>
                        </Dropzone.Draggable>
                    </div>
                    <div class="dropzone-target"></div>
                    <div class="dropzone-target"></div>
                </Dropzone.Target>
            </Dropzone>
        </>
    )
}

const ResizeVariant = () => {
    return (
        <>
            <Resize>
                <div class="resizable-box"></div>
            </Resize>

            {/* With props */}
            <Resize 
                edgeWidth={10} 
                minWidth={100} 
                minHeight={100} 
                maxWidth={500} 
                maxHeight={500} 
                lockAspectRatio={true}
                onWidthChange={(width) => console.log('width changed:', width)}
                onHeightChange={(height) => console.log('height changed:', height)}>
                <div class="resizable-box"></div>
            </Resize>

            {/* Ref methods */}
            {() => {
                ref.resize(200, 200)
                ref.resize(200, null) // only width
                ref.resize(null, 200) // only width
            }}
        </>
    )
}

const RotateVariants = () => {
    return (
        <>
            <Rotate>
                <div class="circle"></div>
            </Rotate>

            {/* With props */}
            <Rotate 
                angle={2}
                onRotation={() => {}} >
                <div class="circle"></div>
            </Rotate>

            {/* Ref methods */}
            {() => {
                ref.rotate(angle)
            }}
        </>
    )
}

const ZoomVariant = () => {
    return (
        <>
            <Zoom>
                <div class="map"></div>
            </Zoom>

            {/* With props */}
            <Zoom
                minZoom={0.5}
                maxZoom={3}
                zoomStep={0.1}
                onZoom={() => {}} >
                <div class="map"></div>
            </Zoom>

            {/* Ref methods */}
            {() => {
                ref.rotate(angle)
            }}
        </>
    )
}

const SpatialNavigatgionVariant = () => {
    // A global wrapper that initializes a navigation for the current screen
    // Provides a ref that will enable configuration
    // actions and gamepad/keyboard bindings will be handled internally
    // Manual customization and programatic control with the ref
    // Each component will be extended to check for the spatial navigation context
    let navigation: NavigationRef;

    const menuRight = () => tabRef.changeTab(); // currently no way to "cycle" tabs
    const menuLeft = () => tabRef.changeTab();

    onMount(() => {
        navigation.configure({
            gamepad: {
                enabled: true,
            },
            keyboard: {
                enabled: true
            },
            actions: {
                // Adding new
                'previous': { button: 'lb', key: 'q', callback: menuLeft },
                'next': { button: 'rb', key: 'e', callback: menuRight },
                // ----- Overriding existing ------
                // We can allow directly modifying the defaults by plugging custom callback 
                // This means that in order to not break the component's implementation we will call the eventBus.emit() for every action
                "select": { button: 'square', key: 'SPACE', callback: onSelect }

                // Internally we have default actions for:
                // up, down, left, right, select, back
                // All components will listen for these actions when spatial navigation is active
            }
        })
    })

    // Action API will be exposed on the ref to add/remove actions dynamically
    const addAction = () => {
        navigation.addAction({ name: 'custom-action', binders: ['E'], callback: () => { } });
    }
    const removeAction = () => {
        navigation.removeAction('custom-action');
    }

    // ----- Extending existing ------
    // Event handlers for the default actions so users can include custom logic
    // We can plug some information in these callbacks for users to use but 
    // Should we include both?
    const handleOnSelect = () => {
        // Custom user logic for when "Select" action is triggered
    }

    const handleOnBack = (scope /* Each Navigation.Area will be treated as a "scope" */) => {
        // Example case:
        // The dropdown in the menu is opened, the user wishes to go back to the menu view and collapse the dropdown
        // but also back should logically close the menu.

        // to do that they can just
        if (scope === "menu-content") closeMenu()
        // This works because the dropdown will init its own scope

        // In short every component that requires navigation will init its own navigation.area which will create a scope
        // Other components like the stepper which will subscribe only to left/right action so triggering the back action will trigger closeMenu

    }

    return (
        <>
            <SpatialNavigation ref={navigation} onSelect={handleOnSelect} onBack={handleOnBack}>
                <Layout>
                    {/* Navigate with LB & RB or (E and R) => bound to action */}
                    <Top></Top>   

                    <Content>
                        <SpatialNavigation.Area name="menu-content">
                            <Column8>
                                {/* We can support 2 ways of wiring up components for interaction */}
                                {/* Option 1 - directly focusing a component */}
                                <Slider>
                                    {/* Slider will iternally listen for focus if spatial navigation is active */}
                                </Slider>

                                {/* Option 2 - anchoring components to element */}
                                {/* For cases where a component needs to react to another element getting focus */}
                                {/* e.g. Menu UIs where the whole row is focused but inner element is still interactable */}
                                <MenuItem id="language-select">
                                    { /* dropdown will internally listen for anchor focus and consider itself active if its anchor is focused */ }
                                    <Dropdown anchor="#language-select"> 
                                        {/* Built in the dropdown internally */}
                                        <SpatialNavigation.Area name="dropdown-{hash}">
                                            <Dropdown.Item>1</Dropdown.Item>
                                            <Dropdown.Item>2</Dropdown.Item>
                                            <Dropdown.Item>3</Dropdown.Item>
                                        </SpatialNavigation.Area>
                                    </Dropdown>
                                </MenuItem>
                            </Column8>
                        </SpatialNavigation.Area>
                        <Column4></Column4>
                    </Content>

                    <Bottom>
                        <div>Exit</div>
                        <div>Select</div>
                        <div>Default</div>
                    </Bottom>
                </Layout>
            </SpatialNavigation>
        </>
    )
}


const Menu = () => {
    let navigation: NavigationRef;

    const menuRight = () => tabsRef.changeTab('Graphics'); // currently no way to "cycle" tabs
    const menuLeft = () => tabsRef.changeTab('Gameplay');

    // User added 
    const defaultActions = {
        'tab-left': {key: 'Q', callback: menuLeft},
        'tab-right': {key: 'E', callback: menuRight},
    }

    return (
        <Navigation ref={navigation} actions={defaultActions}>
            <Layout>
                {/* Navigate with LB & RB or (E and R) => bound to action */}
                <Top></Top>   
                <Content>
                    <SpatialNavigation.Area name="menu-content">
                        <Column8>
                            <Slider>
                                {/* Slider will iternally listen for focus if spatial navigation is active */}
                            </Slider>
                            {/* Option 2 - anchoring components to element */}
                            {/* For cases where a component needs to react to another element getting focus */}
                            {/* e.g. Menu UIs where the whole row is focused but inner element is still interactable */}
                            <MenuItem id="language-select">
                                { /* dropdown will internally listen for anchor focus and consider itself active if its anchor is focused */ }
                                <Dropdown anchor="#language-select"> 
                                    {/* Focusing the Menu Item with id language-select will init a spatial navigation in the dropdown when opened */}                                    
                                    <Dropdown.Item>1</Dropdown.Item>
                                    <Dropdown.Item>2</Dropdown.Item>
                                    <Dropdown.Item>3</Dropdown.Item>
                                </Dropdown>
                            </MenuItem>
                        </Column8>
                    </SpatialNavigation.Area>
                    <Column4></Column4>
                </Content>

                <Bottom>
                    <div>Exit</div>
                    <div>Select</div>
                    <div>Default</div>
                </Bottom>
            </Layout>
        </Navigation>
    )
}