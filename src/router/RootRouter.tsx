import {useSelector} from "react-redux";
import {AuthenticationState} from "../slices/AuthenticationSlice.ts";
import {DomainState} from "../slices/DomainSlice.ts";
import {RootState} from "../slices/Store.ts";
import React from "react";
import UnAuthenticatedRouter from "./UnAuthenticatedRouter.tsx";
import AuthenticatedRouter from "./AuthenticatedRouter.tsx";

export default function RootRouter() {
    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {isLoggedIn} = authenticationState;

    return (
        <div>
            {isLoggedIn ? <AuthenticatedRouter/> : <UnAuthenticatedRouter/>}
        </div>
    )
}