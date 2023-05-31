import {createSlice} from '@reduxjs/toolkit';
import Account from "../models/entities/Account.ts";
import storage from "redux-persist/lib/storage";

export interface AuthenticationState {
    account: Account | undefined;
    isLoggedIn: boolean | undefined;
}


export default createSlice({
    name: 'authentication',
    initialState: <AuthenticationState>{
        account: undefined,
        isLoggedIn: false,
    },
    reducers: {
        login: (state, action) => {
            state.account = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.account = undefined;
            state.isLoggedIn = false;
            storage.removeItem("persist")
        },
        register: (state, action) => {
            state.account = action.payload;
            state.isLoggedIn = false;
        },
    },
});



