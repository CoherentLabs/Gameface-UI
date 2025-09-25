import { ParentComponent } from 'solid-js';
import ProgressBar from './ProgressBar';
import ProgressCircle from './ProgressCircle';
import { ComponentProps } from '@components/types/ComponentProps';
import { clamp } from '@components/utils/clamp';

export interface ProgressProps extends ComponentProps { progress: number }
export const clampProgress = (progress: number) => clamp(progress, 0, 100);

const Progress: ParentComponent = () => <></>;
export default Object.assign(Progress, { Bar: ProgressBar, Circle: ProgressCircle });