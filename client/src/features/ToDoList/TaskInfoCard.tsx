import { Box, Chip, Grid, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { TaskItem } from "../../app/models/TaskItem";
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setSelectedLabels, setTaskItemParams, setTaskListDisplayMode } from "./taskItemSlice";

interface Props {
    taskItem: TaskItem
}

export default function TaskInfoCard({ taskItem }: Props) {
    const { selectedLabels } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();

    var dueDate: DateTime;
    if (taskItem.dueDate !== null) {
        dueDate = DateTime.fromJSDate(new Date(taskItem.dueDate!));
    };

    return (
        <Grid
            container
            direction='column'
        >
            <Grid item>
                <Typography sx={{ fontSize: '1rem'}}>{taskItem.taskName} </Typography>
            </Grid>

            {(taskItem.description) ? (
                <Grid item sx={{ mb: '1rem' }}>
                    <Typography sx={{ fontSize: '0.875rem' }}>{taskItem.description}</Typography>
                </Grid>
            ) : null}

            <Grid item>
                <Grid container display='flex' flexDirection='column' justifyContent='space-between' >
                    <Grid item display='flex' gap={1} sx={{ flexWrap: 'wrap', mb: '0.5rem' }}>
                        {taskItem.label?.map(label =>
                            <div key={label}>
                                <Chip label={label} size="small" onClick={() => {
                                    if (!selectedLabels.includes(label)) {
                                        dispatch(setSelectedLabels([...selectedLabels, label]));
                                        dispatch(setTaskItemParams({ labels: [...selectedLabels, label] }));
                                        dispatch(setTaskListDisplayMode('filter'));
                                    }
                                }} />
                            </div>
                        )}
                    </Grid>

                    {taskItem.dueDate !== null ? (
                        <Grid item >
                            <div className="taskCard-date" style={{ display: 'flex', marginBottom: '0.2rem', alignItems: 'center'}}>
                                <EventNoteIcon sx={{ color: 'grey.600' }}/>
                                <Typography sx={{ fontSize: '0.9rem' }}>
                                    {dueDate!.toLocaleString(DateTime.DATE_HUGE)}
                                </Typography>
                            </div>
                        </Grid>
                    ) : null}

                </Grid>
            </Grid>
        </Grid>
    );
};