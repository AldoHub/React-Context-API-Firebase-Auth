import React , {useState} from "react";
import { Redirect} from "react-router-dom";
import firebase from "../firebase/config";
import { Auth } from "../context/authContext";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [routeRedirect, setRouteRedirect] = useState(false);

    const {state, dispatch} = React.useContext(Auth);

    const login = async(e) => {
        e.preventDefault();
        let response = await firebase.login(email, password);
        if(response.hasOwnProperty("message")){
            console.log(response.message);
        }else{
            //console.log(response.user);
            setRouteRedirect(true);
            return dispatch({
                type: "LOGIN",
                payload: response.user
            });
           
        }



    }

    const redirect = routeRedirect;
    if(redirect){
        return <Redirect to="/" />  
    }

    return(
        <React.Fragment>
            <form onSubmit={login}>
            <p>Welcome back.</p>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Login" />
            </form>
    
        </React.Fragment>

    )


}

export default Login;