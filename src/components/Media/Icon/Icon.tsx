import { Component, createSignal, JSX } from "solid-js";
import { IconMap } from "./IconTypes";
import styles from './Icon.module.scss';
import fallbackImg from './fallback.png?url';
import useBaseComponent from "@components/BaseComponent/BaseComponent";

export interface IconProps {
	style?: JSX.CSSProperties
	class?: string,
	[key: `attr:${string}`]: any;
}

const modules = import.meta.glob('@assets/icons/**/*.{png,svg}', { eager: true }) as Record<string, { default: string }>
// Fallback Icon to prevent app crash when file has been deleted
const MissingIcon: Component<IconProps> = (props) => (
	<img {...props} src={fallbackImg} class={`${styles.fallback} ${props.class || ''}`} />
 )

const IconComponent = (src: string): Component<IconProps> => {
	return (props) => {
		const [hasError, setHasError] = createSignal(false);
		const {forwardAttrs} = useBaseComponent(props);

		return (
			<>
				{hasError() ? (
					<MissingIcon {...props} />
				) : (
					<img
						{...props}
						use:forwardAttrs={props}
						src={src}
						class={`${styles.icon} ${props.class || ''}`}
						onError={() => setHasError(true)}
					/>
				)}
			</>
		);
	};
};

const buildIconTree = (): IconMap => {
	const tree: any = {};

	for (const path in modules) {
		const module = modules[path];
		const src = module.default;

		// Convert "./assets/icons/gamepad/xbox/a.png" -> "gamepad/xbox/a"
		const cleanPath = path
			.replace(/^.*\/assets\/icons\//, '') 
    		.replace(/\.[^/.]+$/, "");

		const keys = cleanPath.split('/');

		let currentLevel = tree;
		keys.forEach((key, index) => {
			if (index === keys.length - 1) {
				currentLevel[key] = IconComponent(src);
			} else {
				currentLevel[key] = currentLevel[key] || {};
				currentLevel = currentLevel[key];
			}
		});
	}

	return tree;
};

export const Icon = buildIconTree();