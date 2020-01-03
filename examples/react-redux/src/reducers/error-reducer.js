import { SET_ERROR, LOGOUT } from 'actions';

const initialState = [];

export function errors(state = initialState, action) {
    switch (action.type) {
        case SET_ERROR:
            return [{ errorType: action.errorType, body: action.body }, ...state];
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
