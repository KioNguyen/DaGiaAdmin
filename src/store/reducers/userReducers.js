import { GET_USERS } from "../actions/userActions";

const initState = {
    users: {}
}

const userReducers = (state = initState, action) => {
    switch (action.type) {
        case GET_USERS:
            console.log(action)
            state = {
                ...state,
                users: action.users
            }
            break;
        default:
            return state;
    }
    return state;
}

export default userReducers;