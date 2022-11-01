import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useHistory } from "react-router-dom";
import { authService } from "../services/AuthService";
import LoadingComponent from "../layout/LoadingComponent";

const modalRoot = document.getElementById('modal-root')!;

export default function SignInRedirectCallback() {
    const history = useHistory();
    
    useEffect(() => {
        authService.signinRedirectCallback().then(() => 
            history.push("/todo"));
    }, [])

    return createPortal(<LoadingComponent message="Authenticating ..." />, modalRoot);
}