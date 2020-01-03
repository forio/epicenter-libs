import { UPDATE_INPUT, UPDATE_INPUTS } from 'actions';

export const updateInput = (name, value) => ({
    type: UPDATE_INPUT,
    name,
    value,
});

export const updateInputs = (inputs) => ({
    type: UPDATE_INPUTS,
    inputs,
});
