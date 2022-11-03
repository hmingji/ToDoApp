import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../layout/Header/PublicHeader";
import { authService } from "../services/AuthService";

interface Props {
    darkMode: boolean,
    handleThemeChange: () => void;
}

export default function SignOutRedirectCallback({ ...props }: Props) {
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) authService.signoutRedirectCallback();
    })
    
    return (
        <>
            <PublicHeader {...props} />
            <Container sx={{ mt: 10}}>   
                {isAuthenticated ? 
                    <Typography>Back to the apps by clicking <Link to='/'>here</Link>.</Typography>
                :   <Typography>You have logged out. Click <Link to='/'>here</Link> to go to main page.</Typography>
                }  
            </Container> 
        </>
    );
}