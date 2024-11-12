type BaseComponentType<P = {}> = (props?: P) => {
    GFUI: {}
    log: typeof console.log
}

const BaseComponent: BaseComponentType = (props) => {
    const GFUI = {}
    const log = console.log;

    return { GFUI, log };
}


export default BaseComponent;