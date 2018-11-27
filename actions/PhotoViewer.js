export const setImages = (payload) =>{
    return {
        type:'SET_IMAGES',
        payload:payload
    }
}

export const setVisible = (payload) =>{
    return {
        type:'SET_VISIBLE',
        payload:payload
    }
}




export const openPhotoViewer = (images,index) =>{
    console.log('open viewer')
    return (dispatch) => {
        dispatch(setImages(images));
        dispatch(setVisible(true));
    }
}