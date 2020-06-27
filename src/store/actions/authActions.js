import { domain, authen_router } from "../../constants";
import axios from 'axios'

export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SIGNUP_USER = 'SIGNUP_USER';
export const ACC_PROF = 'ACC_PROF';

export const signup = (user) => {
    return async dispatch => {
        try {
            let dataPost = {
                name: user.name,
                userName: user.userName,
                password: user.password,
                role: user.role === undefined ? 'CUSTOMER' : user.role
            }
            let response = await axios({
                method: 'post',
                url: `${domain}/${authen_router}/register`,
                data: dataPost,
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (res) {
                return res;
            })
                .catch(function (error) {
                    console.log(error);
                });
            const jsonResponse = await response;
            if (jsonResponse.data.code === 0) {
                window.localStorage.setItem('auth', JSON.stringify(jsonResponse.data.data));
                window.localStorage.setItem('token', JSON.stringify(jsonResponse.data.data.token));
                dispatch({
                    type: AUTHENTICATE_USER,
                    auth: jsonResponse.data.data
                });
            }
            return jsonResponse.data.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export const authenticate = (userName, password) => {
    return async dispatch => {
        let dataPost = {
            userName: userName,
            password: password
        }
        let response = await axios({
            method: 'post',
            url: `${domain}/${authen_router}/login`,
            data: dataPost,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (res) {
            console.log(res)
            return res;
        })
            .catch(function (error) {
                console.log(error);
                return error
            });

        const jsonResponse = await response;
        if (jsonResponse.data.code === 0) {
            window.localStorage.setItem('auth', JSON.stringify(jsonResponse.data.data));
            window.localStorage.setItem('token', JSON.stringify(jsonResponse.data.data.token));
            dispatch({
                type: AUTHENTICATE_USER,
                auth: jsonResponse.data.data
            });
        }
        return jsonResponse.data;
    }
}

export const authenticateSocial = (userProfile) => {
    return async dispatch => {
        let dataPost = {
            userName: userProfile.userName,
            userInfor: {
                name: userProfile.name
            }
        }
        let response = await axios({
            method: 'post',
            url: `${domain}/${authen_router}/social`,
            data: dataPost,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (res) {
            return res;
        })
            .catch(function (error) { });

        const jsonResponse = await response;
        console.log(jsonResponse)
        if (jsonResponse.data.code === 0) {
            console.log(jsonResponse.data)
            window.localStorage.setItem('auth', JSON.stringify(jsonResponse.data.data));
            window.localStorage.setItem('token', JSON.stringify(jsonResponse.data.data.token))
            dispatch({
                type: AUTHENTICATE_USER,
                auth: jsonResponse.data.data
            });
        }
        return jsonResponse.data.data;
    }
}

export const logout = () => {
    return dispatch => {
        const authData = window.localStorage.getItem('auth');
        if (authData) {
            window.localStorage.clear();
            dispatch({
                type: LOGOUT_USER,
                payload: ''
            });
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}

export const getToken = () => {
    return dispatch => {
        const authData = window.localStorage.getItem('auth');
        if (authData) {
            const auth = JSON.parse(authData);
            if (auth.hasOwnProperty('token') && auth.token !== '') {
                dispatch({
                    type: AUTHENTICATE_USER,
                    auth: auth
                });
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }
}

export const getUserInfor = () => {
    return async dispatch => {
        const token = JSON.parse(window.localStorage.getItem('token'))
        let response = await axios({
            method: 'get',
            url: `${domain}/${authen_router}/userInfor`,
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        }).then((res) => {
            return res;
        })
            .catch((error) => { console.log(error) });

        const jsonResponse = await response;
        console.log(jsonResponse)
        if (jsonResponse.data.code === 0) {
            dispatch({
                type: ACC_PROF,
                data: jsonResponse.data.data
            })
        }
        return jsonResponse.data.data;
    }
}