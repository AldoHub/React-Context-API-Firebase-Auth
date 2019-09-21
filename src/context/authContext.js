import React from "react";
//firebaseauth reducer
import { firebaseAuth } from "../reducers/authReducer";


export const Auth = React.createContext();
const initialState = {
    user: {}
}

export const AuthProvider = (props) => {

    const [state, dispatch] = React.useReducer(firebaseAuth, initialState);
    const value = {state, dispatch};

    return <Auth.Provider value={value}>
                {props.children}
           </Auth.Provider>

}
