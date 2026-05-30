import { Component, createSignal } from "solid-js";
import { IconMap } from "./IconTypes";
import styles from './Icon.module.scss';
import baseStyles from '../ImageBase/ImageBase.module.scss';
import fallbackImg from './fallback.png?url';
import baseComponent from "@components/BaseComponent/BaseComponent";
import { ComponentProps, ExcludedEvents } from "@components/types/ComponentProps";
import Events from "@components/types/BaseComponent";
import { JSX } from "@solidjs/web";

export interface IconProps extends Omit<Events, ExcludedEvents> {
	fill?: boolean
	style?: JSX.CSSProperties
    class?: string,
}

const iconClasses = (base: string, props: IconProps) => {
	return `${base} ${props.fill ? baseStyles.fill : ""}`
} 

const modules = import.meta.glob('@assets/icons/**/*.{png,svg}', { eager: true }) as Record<string, { default: string }>
// Fallback Icon to prevent app crash when file has been deleted
const MissingIcon: Component<ComponentProps & {fill?: boolean}> = (props) => {
	props.componentClasses = () => iconClasses(styles.fallback, props);
 
	return <img ref={baseComponent(props)} src={fallbackImg} />;
}

const IconComponent = (src: string): Component<ComponentProps & {fill?: boolean}> => {
	return (props) => {
		const [hasError, setHasError] = createSignal(false);

		props.componentClasses = () => iconClasses(styles.icon, props);

		return (
			<>
				{hasError() ? (
					<MissingIcon {...props} />
				) : (
					<img
						ref={baseComponent(props)}
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