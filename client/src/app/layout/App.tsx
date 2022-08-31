import { Container, createTheme, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Switch } from "react-router";
import ToDo from "../../features/ToDoList/ToDo";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { useMediaQuery } from "usehooks-ts";
import { AuthService } from "../services/AuthService";
import IntroductoryPage from "./IntroductoryPage";
import { Link } from "react-router-dom";

function App() {
    const authService = new AuthService();
    const [darkMode, setDarkMode] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const matches = useMediaQuery('(min-width: 918px)');
    const paletteType = darkMode ? 'dark' : 'light';
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === 'light' ? '#eaeaea' : '#121212'
            }
        }
    })

    useEffect(() => {
        if (!matches && drawerOpen) setDrawerOpen(false);
        if (matches && !drawerOpen) setDrawerOpen(true);
    }, [matches]);

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    function handleDrawerOpenChange() {
        setDrawerOpen(!drawerOpen);
    }

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
                <ThemeProvider theme={theme}>
                    <ToastContainer position="bottom-left" hideProgressBar theme='colored' /> 
                    <CssBaseline />
                    <Header darkMode={darkMode} handleThemeChange={handleThemeChange} handleDrawerOpenChange={handleDrawerOpenChange} authService={authService} drawerOpen={drawerOpen} />
                    <Container sx={{ mt: 10}}>   
                        <Switch>
                            <Route exact path='/' render={() => <IntroductoryPage authService={authService} /> } />
                            <Route path='/todo' render={() => {
                                if (!authService.isAuthenticated()) authService.signinRedirect();
                                authService.getUser();
                                return <ToDo drawerOpen={drawerOpen} authService={authService} darkMode={darkMode} />
                            }} />
                            <Route path='/signin-oidc' render={() => {
                                authService.getUser();
                                return null;
                            }} />
                            <Route path='/signout-callback-oidc' render={() => {
                                return <Typography> You have logged out. Click <Link to='/'>here</Link> to go to main page. </Typography>;
                            }} />
                            <Route path='/silent-signin' render={() => {
                                authService.signinSilentCallback();
                                authService.getUser();
                                return null;
                            }} />
                        </Switch>
                    </Container>
                </ThemeProvider>
            </MuiPickersUtilsProvider>
        </LocalizationProvider>
  );
}

export default App;
