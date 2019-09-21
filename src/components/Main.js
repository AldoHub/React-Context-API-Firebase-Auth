import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/config";

import { Posts } from "../context/postsContext";

const Main = () => {

    const {state, dispatch} = React.useContext(Posts);

    const getPosts = async() => {
        //let _posts = [];
        const postsArray = await firebase.getPosts().catch(err => {
            console.log(err);
            return err;
        });
        /*
        postsArray.forEach(doc => {
            _posts.push({id:doc.id, data:doc.data});
        });
        */
        return dispatch({
            type: "FETCH_POSTS",
            payload: postsArray
        });

    }

    useEffect(() => {
        getPosts();
    }, [])


    return(
        <React.Fragment>
             <header>
                <div>
                <h1>React Context <br/> Hooks <br/> Firebase</h1>
                </div>
           </header>

           <div className="posts">
            {state.posts.map(post => {
                return (
                    <div className="post" key={post.id}>
                        <Link to={"post/" + post.id}>
                        <div style={{backgroundImage: "url(" + post.data.cover + ")" }} />
                        </Link>
                    </div>
                )
            })}
           </div>

        </React.Fragment>
    );
}

export default Main;