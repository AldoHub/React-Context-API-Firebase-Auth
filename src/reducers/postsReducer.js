export const posts = (state, action) => {
    switch(action.type){
        case "FETCH_POSTS":
            return{...state, posts: action.payload}
        
        default:
            return state;

      
    }
}