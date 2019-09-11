import { ACTION } from '../utils/Types';

export const alerts = {
    success,
    error,
    clear
};

function success(message) {
    return { type: ACTION.SUCCESS, message };
}

function error(message) {
    return { type: ACTION.ERROR, message };
}

function clear() {
    return { type: ACTION.CLEAR };
}