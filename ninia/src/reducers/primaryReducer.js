import initialState from './initialState'
import tokenize from './reducerFunctions/tokenize'
import JSONify from './reducerFunctions/tokenize'
import toJSON from './reducerFunctions/universalize'
import './reducerFunctions/universalize';
import Universalizer from './reducerFunctions/universalize';

const reducer = (state = initialState, action) =>{
    switch(action.type){
        case "UPDATE_SOURCE_CODE":
            state = {
                ...state,
                leftText : action.payload,
                // rightText : [...state.rightText, action.payload]
            };
            break;
        case "TOKENIZE":
            let t = tokenize(action.payload)
            state = {
                ...state,
                tokens: t,
                tokenizedText: JSON.stringify(t, null, 2)
            };
            break;
        case "JSON":
                state = {
                    ...state,
                    json : action.payload
                };
                break;
        case "OUTPUT":
            state = {
                ...state,
                python : action.payload, //action.payload
                display: true
            };
            break;
        
        case "JSON":
           state = {
                ...state,
                JSONText: Universalizer(action.payload)
           };
           break;

        case "COMPILE":
            state = {
                ...state,
                compiledJava: action.payload
            };
            break;

        default:
            state = initialState;
    }
    return state;
}

export default reducer;