import {createSlice} from '@reduxjs/toolkit';

export interface MessageModalState {
    isShow: boolean | undefined;
    type: string | undefined;
    title: string | undefined;
    content: string | undefined;
}


export default createSlice({
    name: 'messageModal',
    initialState: <MessageModalState>{
        isShow: false,
        type: undefined,
        content: undefined,
    },
    reducers: {
        set: (state, action) => {
            state = {...state, ...action.payload};
        },
    }
});




