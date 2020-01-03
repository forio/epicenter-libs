import { SET_LOADING, LOGOUT } from 'actions';

const initialState = [];

function handleLoading(state, type, isLoading, ignoreLoadScreen = false) {
    const idx = state.findIndex((load) => load.loading === type);
    const newState = JSON.parse(JSON.stringify(state));
    if (isLoading) {
        // if the loading type is already here, just update the ignore load screen; otherwise, add it to the list
        if (idx >= 0) {
            Object.assign(newState[idx], { ignoreLoadScreen });
        } else {
            newState.push({ loading: type, ignoreLoadScreen });
        }
        return newState;
    } else if (!isLoading && idx >= 0) {
        newState.splice(idx, 1);
        return newState;
    }
    return state;
}

export function loading(state = initialState, action) {
    switch (action.type) {
        case SET_LOADING:
            return handleLoading(state, action.loadType, action.isLoading, action.ignoreLoadScreen);
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
