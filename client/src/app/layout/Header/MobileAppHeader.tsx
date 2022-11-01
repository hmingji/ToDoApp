import { IconButton, Tooltip, Grid } from "@mui/material";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { setTaskItemCreateMode, setTaskItemParams, setTaskListDisplayMode } from "../../../features/ToDoList/taskItemSlice";
import MenuIcon from '@mui/icons-material/Menu';
import SignedInMenu from "../SignedInMenu";
import CloseIcon from '@mui/icons-material/Close';
import ThemeSwitch from "../../components/ThemeSwitch";
import MobileTaskSearch from "../../../features/ToDoList/MobileTaskSearch";
import SearchIcon from '@mui/icons-material/Search';

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
    handleDrawerOpenChange: () => void;
    drawerOpen: boolean;
}

export default function MobileAppHeader({ darkMode, handleThemeChange, handleDrawerOpenChange, drawerOpen } : Props) {
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const { username } = useAppSelector(state => state.account); 
    const dispatch = useAppDispatch();
    
    function toggleSearchOpen() {
        setSearchBarOpen(!searchBarOpen);
    }

    return (
        <>
            {searchBarOpen ? (
                <MobileTaskSearch toggleSearchOpen={toggleSearchOpen} />
            ) : (
                <Grid container display='flex' alignItems="center" justifyContent="space-between">
                    <IconButton onClick={handleDrawerOpenChange}>
                        {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>

                    <Grid item display='flex' gap='1rem' alignItems="center">
                        <Tooltip title="Search task">
                            <IconButton onClick={toggleSearchOpen}>
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Create task">
                            <IconButton
                                onClick={() => {
                                    dispatch(setTaskListDisplayMode('toDoList'));
                                    dispatch(setTaskItemParams({ status: 'Incomplete' }));
                                    dispatch(setTaskItemCreateMode(true));
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>

                        <ThemeSwitch darkMode={darkMode} handleThemeChange={handleThemeChange} />
                        <SignedInMenu username={username} />
                    </Grid>
                </Grid>
            )}
        </>        
    );
}