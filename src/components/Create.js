import React ,{useEffect, useState}  from "react";
import { Redirect, withRouter } from 'react-router';
import firebase from "../firebase/config";

const Create = (props) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [routeRedirect, setRedirect] = useState(false);   
    const [loading, setLoading] = useState("");


    const addPost = async(e) =>{
        e.preventDefault();
        setIsBusy(true);

        let d;
        let post = {
            title,
            content,
            cover: cover[0]
        }


        const storageRef = firebase.storage.ref();
        const storageChild = storageRef.child(post.cover.name);
        const postCover = storageChild.put(post.cover);

        await new Promise(resolve => {
            postCover.on("state_changed", (snapshot) => {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setLoading(Math.trunc(progress));
            }, (error) => {
                //error
                console.log(error);
            }, async() => {
                //completed
                const downloadURL = await storageChild.getDownloadURL();
                d = downloadURL;
                console.log(d);
                resolve();
            });
        });

        firebase.createPost(d, post).then((post) => {
            console.log(post);
            setIsBusy(false);
            setRedirect(true);
        }).catch(err => {
            console.log(err);
            setIsBusy(false); 
        });

    }



    useEffect(() => {
        firebase.getUserState().then(user => {
            if(!user){
                props.history.replace("/login");
            }
        })
    });


    const redirect = routeRedirect;
    if(redirect){
        return <Redirect to="/" />  
    }


    let createForm;
    if(isBusy){
        createForm = (
                    <div className="processing">
                        <p>Request is being processed  <span className="process">{loading}%</span></p>
                        <div className="loader">Loading...</div>
                    </div> 
        )
    }else{
        createForm = (
                    <form onSubmit={addPost}>
                        <p>Create a new post</p>
                        
                        <label htmlFor="title">Post Title: </label>
                        <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                        
                        <label htmlFor="content">Post Content: </label>
                        <textarea name="content"  onChange={(e) => setContent(e.target.value)}  ></textarea>
                    
                        <label htmlFor="cover" className="cover">Cover</label>
                        <input type="file" onChange={(e) => setCover(e.target.files)} />

                        <input type="submit" value="create post" />
                    </form>
        )
    }

    return (
        <React.Fragment>
            {createForm}
        </React.Fragment>
    )

}

export default withRouter(Create);