import React , {useEffect, useState, useRef} from "react";
import { Redirect } from 'react-router';
import firebase from "../firebase/config";

const Post = (props) => {

    const [timer, setTimer] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [userState, setUserState] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [post, setPost] = useState("");
    const [loading, setLoading] = useState("");

    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const fileRef = useRef(null);

    const [postid, setPostId] = useState("");
    const [routeRedirect, setRedirect] = useState(false);   

    const getPost = async(postid) => {
        const _post = await firebase.getPost(postid).catch(err =>{
            console.log(err);
            return err;
        });

        setPost(_post);
    }


    useEffect(() => {
       setTimer(true);
       setPostId(props.match.params.id);
       getPost(props.match.params.id); 
       
       firebase.getUserState().then(user => {
           if(user){
               setUserState(user);
           }
       });


       setTimeout(() => setTimer(false), 1000);

    },[props.match.params.id]);

    const redirect = routeRedirect;
    if(redirect){
        return <Redirect to="/" />  
    }


    let currentPost;
    let editButton;
    let deleteButton;

    const updateCurrentPost = async(e) => {
        e.preventDefault();
        setIsBusy(true);
        
        let d;
        const _post = {
            title: titleRef.current.value,
            content: contentRef.current.value
        }

        if(fileRef.current.files.length > 0){
            _post["cover"] = fileRef.current.files[0];
            _post["oldcover"] = post.fileref;

            const storageRef = firebase.storage.ref();
            const storageChild = storageRef.child(_post.cover.name);
            const postCover = storageChild.put(_post.cover);

            await new Promise(resolve => {
                postCover.on("state_changed", (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setLoading(Math.trunc(progress));
    
                }, (error) => {
                        console.log(error);
                }, async() => {
                    const downloadURL = await storageChild.getDownloadURL();    
                    d = downloadURL;
                    resolve(); 
                   
                });
  
  
            });

        }

        firebase.updatePost(d, postid, _post).then(() => {
            console.log("post updated");
            setIsBusy(false);
            setRedirect(true);
        }).catch(err => {
            setIsBusy(false);
            console.log(err);
        });
      
    }


    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    const deleteCurrentPost = () =>{
        firebase.deletePost(postid, post.fileref)
        .then(() => {
            setRedirect(true);
        }).catch(err => {
            console.log(err);
        })
    }

    let updateForm;
    if(editMode){
        deleteButton =  <button className="delete" onClick={(e) => deleteCurrentPost()}>Delete Post</button>
    
        if(isBusy){
            updateForm = (
                <div className="processing">
                    <p>Request is being processed <span className="process">{loading}%</span></p>
                    <div className="loader">Loading...</div>
                </div>
            )
        }else{
            updateForm = (
                <React.Fragment>
                <form className="editForm" onSubmit={updateCurrentPost}>
                    <p>Update the current post</p>
                        
                        <label htmlFor="title">Post Title: </label>
                        <input type="text" name="title" ref={titleRef} defaultValue={post.title} />
                        
                        <label htmlFor="content">Post Content: </label>
                        <textarea name="content" ref={contentRef} defaultValue={post.content} ></textarea>
                    
                        <label htmlFor="cover" className="cover">Cover</label>
                        <input type="file" ref={fileRef} />

                        <input type="submit" value="update post" />
                </form>

                {deleteButton}
                </React.Fragment>
            )
        }

    }


    if(timer){
        currentPost = (
            <div className="processing">
                <p>Loading Post</p>
                <div className="loader">Loading...</div>
            </div>
        )
    }else{

        if(userState){
            editButton =  <button className="edit" onClick={(e) =>toggleEditMode()}>Edit Post</button>;
        }

        currentPost = (
            <div className="single">
                <img src={post.cover} alt="post cover"/>
                <h2>{post.title}</h2>
                <div>{post.content}</div>
                {editButton}
                {updateForm}
            </div>
        )
    } 


    return(
        <React.Fragment>
           {currentPost}
        </React.Fragment>
    );

}

export default Post;