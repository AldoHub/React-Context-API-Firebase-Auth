import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from "./context/authContext";
import { BrowserRouter } from "react-router-dom";
import { PostsProvider } from "./context/postsContext";


ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <PostsProvider>
                <App />
            </PostsProvider>
        </AuthProvider>
    </BrowserRouter>
    
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
