import viewModel from './model.json';
import sharedModel from '../../../models/_shared.json';
import { createBindingProxy } from "../../../binding/bindingProxy";

export const mergedModel = { ...viewModel, ...sharedModel };
export const bindModel = createBindingProxy<typeof mergedModel>('', mergedModel);

// User defined iterators
export const playerIt = bindModel.players.bindIter('player');
export const weaponIt = playerIt.weapons.bindIter('weapon');
export const ammoIt = weaponIt.ammo.bindIter();
