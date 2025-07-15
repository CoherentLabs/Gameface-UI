import { After, Before, Input } from "../InputBase/tokens";
import { createTextInputVariant } from "../TextInputVariants/createTextInputVariant";

const PasswordInput = createTextInputVariant('password');
export default Object.assign(PasswordInput, { Before, After, Input });