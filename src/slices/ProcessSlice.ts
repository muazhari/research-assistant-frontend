import {createSlice} from '@reduxjs/toolkit';


export interface ProcessState {
    isLoading: boolean | undefined;
}

export default createSlice({
    name: 'process',
    initialState: <ProcessState>{
        isLoading: false,
    },
    reducers: {
        set(state, action) {
            state.isLoading = action.payload.isLoading;
        }
    },
});



