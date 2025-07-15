import { After, Before, Input, Placeholder } from "../InputBase/tokens";
import { createTextInputVariant } from "../TextInputVariants/createTextInputVariant";

const TextInput = createTextInputVariant('text');
export default Object.assign(TextInput, { Before, After, Input, Placeholder });