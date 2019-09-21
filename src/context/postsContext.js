import React from 'react';
import {posts} from "../reducers/postsReducer";

export const Posts = React.createContext();
const initialState = {
    posts: []
}

export const PostsProvider = (props) =>{
    const [state, dispatch] = React.useReducer(posts, initialState);
    const value = {state, dispatch};

    return <Posts.Provider value={value}>
                {props.children}
           </Posts.Provider>
}