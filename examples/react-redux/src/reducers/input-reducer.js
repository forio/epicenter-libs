import { UPDATE_INPUT, UPDATE_INPUTS, LOGOUT } from 'actions';

const initialState = {
};

export function inputs(state = initialState, action) {
    switch (action.type) {
        case UPDATE_INPUTS:
            return { ...state, ...action.inputs };
        case UPDATE_INPUT:
            return { ...state, [action.name]: action.value };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
