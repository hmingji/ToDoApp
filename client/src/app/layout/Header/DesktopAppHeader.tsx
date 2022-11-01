import { IconButton, Tooltip, Grid } from "@mui/material";
import TaskSearch from "../../../features/ToDoList/TaskSearch";
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SignedInMenu from "../SignedInMenu";
import CloseIcon from '@mui/icons-material/Close';
import ThemeSwitch from "../../components/ThemeSwitch";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { setTaskItemCreateMode, setTaskItemParams, setTaskListDisplayMode } from "../../../features/ToDoList/taskItemSlice";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
    handleDrawerOpenChange: () => void;
    drawerOpen: boolean;
}

export default function DesktopAppHeader({ darkMode, handleThemeChange, handleDrawerOpenChange, drawerOpen } : Props) {
    const { username } = useAppSelector(state => state.account); 
    const dispatch = useAppDispatch();
    
    return (
        <Grid container display='flex' alignItems="center" justifyContent="space-between">
            <IconButton onClick={handleDrawerOpenChange}>
                <MenuIcon />
            </IconButton>

            <TaskSearch />

            <Grid item display='flex' gap='0.1rem' alignItems="center">
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
    );
}