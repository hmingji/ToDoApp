import { AppBar, Box, IconButton, Switch, Toolbar, Typography, Button, Tooltip } from "@mui/material";
import React, { useState } from "react";
import TaskSearch from "../../features/ToDoList/TaskSearch";
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchUserInfo, setTaskItemCreateMode, setTaskItemParams, setTaskListDisplayMode } from "../../features/ToDoList/taskItemSlice";
import MenuIcon from '@mui/icons-material/Menu';
import { AuthService } from "../services/AuthService";
import SignedInMenu from "./SignedInMenu";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useMediaQuery } from "usehooks-ts";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from "react-router-dom";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
    handleDrawerOpenChange: () => void;
    authService: AuthService;
    drawerOpen: boolean;
}

export default function Header({ darkMode, handleThemeChange, handleDrawerOpenChange, authService, drawerOpen } : Props) {
    const [createButtonOnHover, setCreateButtonOnHover] = useState(false);
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const { username } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();
    const matches = useMediaQuery('(min-width: 918px)');
    const smallViewMatches = useMediaQuery('(min-width: 600px)');
    const location = useLocation();

    React.useEffect(() => {
        if (authService.isAuthenticated()) dispatch(fetchUserInfo(authService));
    }, [dispatch, authService.isAuthenticated()]);

    return (
        <AppBar
            position='fixed'
            sx={{ top: 0, left: 0, mb: 4, zIndex: (theme) => (theme.zIndex.drawer + 1) }}
        >
            <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
            >  
                {(!searchBarOpen || matches) ? (
                    <Box display='flex' alignItems='center' gap='1rem' >
                        {(authService.isAuthenticated()) ? (
                            <IconButton onClick={handleDrawerOpenChange}>
                                {(drawerOpen && !matches) ? <CloseIcon /> : <MenuIcon />}
                            </IconButton>
                        ) : null}

                        {(location.pathname === "/") ? (
                            <Typography
                                variant='h6'
                                sx={{ textDecoration: 'none', color: 'white' }}
                            >
                                To Do App
                            </Typography>
                        ) : null}
                    </Box>
                ) : null}

                {(searchBarOpen && !matches) ? (
                    <IconButton onClick={() => setSearchBarOpen(!searchBarOpen)}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : null}

                {(authService.isAuthenticated() && (matches || searchBarOpen)) ? (
                    <TaskSearch />
                ) : null}

                {(!searchBarOpen || matches) ? (
                    <Box display='flex' alignItems='center' justifyContent='right' gap='0.2rem'>
                        {(authService.isAuthenticated() && !matches) ? (
                            <IconButton onClick={() => setSearchBarOpen(!searchBarOpen)}>
                                <SearchIcon />
                            </IconButton>
                        ) : null}

                        {(authService.isAuthenticated()) ? (
                            <Tooltip title="Create task">
                                <IconButton
                                    onMouseEnter={() => setCreateButtonOnHover(true)}
                                    onMouseLeave={() => setCreateButtonOnHover(false)}
                                    onClick={() => {
                                        dispatch(setTaskListDisplayMode('toDoList'));
                                        dispatch(setTaskItemParams({ status: 'Incomplete' }));
                                        dispatch(setTaskItemCreateMode(true));
                                    }}
                                >
                                    {createButtonOnHover ? <AddCircleIcon /> : <AddIcon />}
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    
                        <Switch
                            disableRipple
                            checked={darkMode}
                            onChange={handleThemeChange}
                            checkedIcon={<div style={{ backgroundColor: 'white', borderRadius: '50%', height: '25px', width: '25px', transform: 'translate(0px, -3px)' }}> <DarkModeIcon fontSize="small" sx={{ transform: 'translate(2px, 2px)' }} /> </div>}
                            icon={<div style={{ backgroundColor: 'white', borderRadius: '50%', height: '25px', width: '25px', transform: 'translate(0px, -3px)' }}> <LightModeIcon fontSize="small" sx={{ transform: 'translate(2px, 2px)', color: 'orange' }} /> </div> }
                        
                        />
                    
                        {(!authService.isAuthenticated()) ?
                            (<Button onClick={() => authService.signinRedirect()} sx={{ color: 'white' }} >Login</Button>)
                            : (<SignedInMenu username={username} authService={authService}/>)
                        }

                    </Box>
                ) : null}
            </Toolbar>
        </AppBar>
    )
}