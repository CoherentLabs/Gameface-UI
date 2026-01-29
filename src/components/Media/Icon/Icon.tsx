import { Component, createSignal, JSX } from "solid-js";
import { IconMap } from "./IconTypes";
import styles from './Icon.module.scss';
import fallbackImg from './fallback.png?url';
import baseComponent from "@components/BaseComponent/BaseComponent";
import { ComponentProps } from "@components/types/ComponentProps";

const modules = import.meta.glob('@assets/icons/**/*.{png,svg}', { eager: true }) as Record<string, { default: string }>
// Fallback Icon to prevent app crash when file has been deleted
const MissingIcon: Component<ComponentProps> = (props) => {
	props.componentClasses = styles.fallback;

	return <img use:baseComponent={props} src={fallbackImg} />;
}


const IconComponent = (src: string): Component<ComponentProps> => {
	return (props) => {
		const [hasError, setHasError] = createSignal(false);

		props.componentClasses = styles.icon;

		return (
			<>
				{hasError() ? (
					<MissingIcon {...props} />
				) : (
					<img
						use:baseComponent={props}
						src={src}
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