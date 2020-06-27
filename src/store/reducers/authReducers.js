import { AUTHENTICATE_USER, LOGOUT_USER, SIGNUP_USER, ACC_PROF } from "../actions/authActions";

const initState = {
    isAuthenticated: false,
    account: {},
    token: ''
}

const authReducers = (state = initState, action) => {
    switch (action.type) {
        case SIGNUP_USER:
            state = {
                ...state,
                isAuthenticated: true,
                account: action.auth.account,
                token: action.auth.token
            }
            break;
        case AUTHENTICATE_USER:
            state = {
                ...state,
                isAuthenticated: true,
                account: action.auth.account,
                token: action.auth.token
            }
            break;
        case LOGOUT_USER:
            state = {
                isAuthenticated: false,
                account: {},
                token: ''
            }
            break;
        case ACC_PROF:
            state = {
                ...state,
                isAuthenticated: true,
                accProf: action.data
            }
        default:
            return state;
    }
    return state;
}

export default authReducers;