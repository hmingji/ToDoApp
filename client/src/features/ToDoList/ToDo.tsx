import useTaskItems from "../../app/hooks/useTaskItems"
import { Grid } from "@mui/material";
import TaskList from "./TaskList";
import { useMediaQuery } from "usehooks-ts";
import SideBar from "../../app/layout/SideBar";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setTaskItemParams, setTaskListDisplayMode } from "./taskItemSlice";
import { TaskItem } from "../../app/models/TaskItem";
import { AuthService } from "../../app/services/AuthService";

interface Props {
    drawerOpen: boolean;
    authService: AuthService
}

const displayMode = [
    { mode: 'toDoList', taskStateFilter: 'Incomplete' },
    { mode: 'completed', taskStateFilter: 'Completed' },
    { mode: 'filter', taskStateFilter: 'Incomplete' }
]
export default function ToDo({ drawerOpen, authService }: Props) {
    const { taskItems } = useTaskItems(authService);
    const { taskListDisplayMode } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();
    const matches = useMediaQuery('(min-width: 918px)');
    const taskItemsToDisplay: TaskItem[] = taskItems.filter(item => {
        switch (taskListDisplayMode) {
            case 'toDoList':
                return item.status === 'Incomplete';
            case 'completed':
                return item.status === 'Completed';
            default:
                return item.status === 'Incomplete';
        }
    })

    function handleDisplayModeChange(mode: string) {
        dispatch(setTaskListDisplayMode(mode));
        dispatch(setTaskItemParams({ status: displayMode.find(item => item.mode === mode)?.taskStateFilter }));
    }

    return (
        <>
            <SideBar
                open={drawerOpen}
                displayMode={taskListDisplayMode}
                handleDisplayModeChange={handleDisplayModeChange}
                authService={authService}
            />
            <Grid
                container
                columnSpacing={4}
                direction='row-reverse'
                sx={{ pl: (drawerOpen && matches) ? '350px' : '0px' }}
            >
                <Grid item xs={12}>
                    <TaskList
                        taskItems={taskItemsToDisplay}
                        authService={authService}
                    />
                </Grid>
            </Grid>
        </>
    )
}