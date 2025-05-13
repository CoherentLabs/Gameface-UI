import { createToken } from '@solid-primitives/jsx-tokenizer';
import { ScrollContentTokenizer } from './tokenizers';


export default createToken(ScrollContentTokenizer, (props) => ({ props, id: 'Content'}));