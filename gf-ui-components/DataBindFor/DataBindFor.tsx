import { ParentComponent } from "solid-js";

function bindFor<T, K>(
    model: T,
    iterator?: K | string,
    indexKey?: string
): string {
    if (iterator) {
        // From the proxy the iterator name is returned in {{iterator_12345}} syntax. That is why we need to remove the {{ }} brackets
        // so data-bind-for attribute receives iter:{{model}} instead of {{iter}}:{{model}}
        if (typeof iterator !== 'string') iterator = iterator.toString();
        iterator = iterator.replace("{{", '').replace("}}", '');
        if (!indexKey) return `${iterator}:${model}`;
        return `${indexKey},${iterator}:${model}`;
    }

    return `${model}`;
}

interface DataBindForProps {
    model: any;
    iter?: any
}

const DataBindFor: ParentComponent<DataBindForProps> = (props) => {
    return <div data-bind-for={bindFor(props.model, props.iter)}>
        {props.children}
    </div>
}

export default DataBindFor;