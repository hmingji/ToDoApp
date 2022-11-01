import { Grid} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TaskItem } from "../../app/models/TaskItem";
import TaskCheckBox from "./TaskCheckBox";
import { removeTaskItem, setTaskItem } from "./taskItemSlice";
import { useAppDispatch } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import TaskInfoCard from "./TaskInfoCard";
import TaskForm from "./TaskForm";
import TaskAction from "./TaskAction";
import { toast } from "react-toastify";

interface Props {
    taskItem: TaskItem; 
}

export default function TaskCard({ taskItem } : Props) {
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [displayWidthMatches, setDisplayWidthMatches] = useState(window.matchMedia("(min-width: 768px)").matches);
    const [cardOnMouseOver, setCardOnMouseOver] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)");
        const listener = () => setDisplayWidthMatches(media.matches);
        window.addEventListener("resize", listener);

        return () => window.removeEventListener("resize", listener); 
    }, []);

    function handleEditModeChange() {
        setEditMode(!editMode);
    }

    async function handleTaskItemDeleteOnClick(id: number) {
        await agent.Task.deleteTask(taskItem.id);
        dispatch(removeTaskItem(taskItem));
        toast.info('Task removed.');
    }

    async function handleStatusChange() {
        try {
            if (taskItem.status === "Incomplete") {
                const updatedTaskItem: TaskItem = {
                    id: taskItem.id,
                    taskName: taskItem.taskName,
                    description: taskItem.description,
                    dueDate: taskItem.dueDate,
                    assignee: taskItem.assignee,
                    status: "Completed",
                    label: taskItem.label,
                    priority: taskItem.priority
                }
                await agent.Task.updateTask(updatedTaskItem);
                dispatch(setTaskItem(updatedTaskItem));
            } else {
                const updatedTaskItem: TaskItem = {
                    id: taskItem.id,
                    taskName: taskItem.taskName,
                    description: taskItem.description,
                    dueDate: taskItem.dueDate,
                    assignee: taskItem.assignee,
                    status: "Incomplete",
                    label: taskItem.label,
                    priority: taskItem.priority
                }
                await agent.Task.updateTask(updatedTaskItem);
                dispatch(setTaskItem(updatedTaskItem));
            }
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
            sx={{ border: 1, borderColor: 'grey.400', borderRadius: 1, padding: 1, paddingLeft: 0.25, paddingRight: 0.1, pb: '0.2rem', pt: '0.2rem' }}
            onMouseOver={() => setCardOnMouseOver(true)}
            onMouseLeave={() => setCardOnMouseOver(false)}
        >
            <Grid item xs={(displayWidthMatches) ? 0.7 : 1} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'start' }}>
                <TaskCheckBox taskItem={taskItem} handleStatusChange={handleStatusChange}/>
            </Grid>

            <Grid item xs={(displayWidthMatches) ? 10.6 : 10} sx={{ justifyContent: 'left' }}>
                <TaskInfoCard taskItem={taskItem}/>
            </Grid>

            {(cardOnMouseOver) ? (
                <Grid item xs={(displayWidthMatches) ? 0.7 : 1} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'start' }}>
                    <TaskAction editMode={editMode} handleEditModeChange={handleEditModeChange} handleDeleteOnClick={() => handleTaskItemDeleteOnClick(taskItem.id)} />
                </Grid>
            ) : null}
        </Grid>
    );
};
