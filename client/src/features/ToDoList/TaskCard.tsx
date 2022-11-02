import { Grid} from "@mui/material";
import { useState } from "react";
import { TaskItem } from "../../app/models/TaskItem";
import TaskCheckBox from "./TaskCheckBox";
import { removeTaskItem, setTaskItem } from "./taskItemSlice";
import { useAppDispatch } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import TaskInfoCard from "./TaskInfoCard";
import TaskForm from "./TaskForm";
import TaskAction from "./TaskAction";
import { toast } from "react-toastify";
import { useMediaQuery } from "usehooks-ts";

interface Props {
    taskItem: TaskItem; 
}

export default function TaskCard({ taskItem } : Props) {
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const matches = useMediaQuery('(min-width: 768px)');
    const [cardOnMouseOver, setCardOnMouseOver] = useState(false);

    function handleEditModeChange() {
        setEditMode(!editMode);
    }

    async function handleTaskItemDeleteOnClick(id: number) {
        await agent.Task.deleteTask(taskItem.id!);
        dispatch(removeTaskItem(taskItem));
        toast.info('Task removed.');
    }

    async function handleStatusChange() {
        try {
            const updatedTaskItem: TaskItem = {
                ...taskItem,
                status: (taskItem.status === "Completed") ? 
                    "Incomplete" : 
                    "Completed",
            }
            await agent.Task.updateTask(updatedTaskItem);
            dispatch(setTaskItem(updatedTaskItem));
            toast.info("Task updated");   
        } catch (error: any) {
            console.log(error.data);
        }
    };

    function cancelEdit() {
        setEditMode(false);
        setCardOnMouseOver(false);
    }

    if (editMode) return <TaskForm taskItem={taskItem} cancelEdit={cancelEdit} />

    return (
        <Grid
            container
            display='flex'
            direction='row'
            sx={{ border: 1, borderColor: 'grey.400', borderRadius: 1, py: '0.2rem' }}
            onMouseOver={() => setCardOnMouseOver(true)}
            onMouseLeave={() => setCardOnMouseOver(false)}
        >
            <Grid 
                item
                display="flex" 
                xs={(matches) ? 0.7 : 1} 
                justifyContent="center"
                alignItems="start"
            >
                <TaskCheckBox taskItem={taskItem} handleStatusChange={handleStatusChange}/>
            </Grid>

            <Grid 
                item 
                xs={(matches) ? 10.6 : 10} 
                justifyContent="left"
            >
                <TaskInfoCard taskItem={taskItem}/>
            </Grid>

            {(cardOnMouseOver) ? (
                <Grid 
                    item 
                    xs={(matches) ? 0.7 : 1} 
                    display="flex"
                    justifyContent="center"
                    alignItems="start"
                >
                    <TaskAction 
                        editMode={editMode} 
                        handleEditModeChange={handleEditModeChange} 
                        handleDeleteOnClick={() => handleTaskItemDeleteOnClick(taskItem.id!)} 
                    />
                </Grid>
            ) : null}
        </Grid>
    );
};
