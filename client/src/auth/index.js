import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

export const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    FAIL_USER: "FAIL_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: ""
    });
    const history = useHistory();
    
    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: ""
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: ""
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: ""
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: ""
                })
            }
            case AuthActionType.FAIL_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: payload
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userName, firstName, lastName, email, password, passwordVerify) {
        try
        {
            const response = await api.registerUser(userName, firstName, lastName, email, password, passwordVerify);      
            if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            }
        }
        catch(error)
        {
            authReducer({
                type: AuthActionType.FAIL_USER,
                payload: error.response.data.errorMessage
            })
        }
    }

    auth.loginUser = async function(email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            }
        }
        catch(error)
        {
            authReducer({
                type: AuthActionType.FAIL_USER,
                payload: error.response.data.errorMessage
            })
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        const guestUserName = "LvpDwRfQSyohcKXDY2KXnb3PSu4DcXrExni4wcycFqS1cCWcyRO60Qa9edp13W4"
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
            if (auth.user.userName === guestUserName)
            {
                initials = "GUEST"
            }
        }

        console.log("user initials: " + initials);
        return initials;
    }

    auth.clearErrorMessage = function() {
        authReducer( {
            type: AuthActionType.LOGOUT_USER,
            payload: null
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };