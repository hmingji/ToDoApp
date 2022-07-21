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

            <Grid item sx={{ mb: '0.5rem' }}>
                <Typography sx={{ fontSize: '0.875rem' }}>{taskItem.description}</Typography>
            </Grid>

            <Grid item>
                <Box display='flex' sx={{ alignItems: 'center' }} >
                    {taskItem.dueDate !== null ? (
                        <div className="taskCard-date" style={{ display: 'flex'}}>
                            <EventNoteIcon fontSize="small" sx={{ color: 'grey.600' }}/>
                            <Typography sx={{ fontSize: '0.875rem' }}>
                                {dueDate!.toLocaleString(DateTime.DATE_HUGE)}
                            </Typography>
                        </div>
                    ) : null}
                    
                    {taskItem.label?.map(label =>
                        <div key={label} style={{ marginLeft: '0.5rem' }}>
                            <Chip label={label} size="small" onClick={() => {
                                if (!selectedLabels.includes(label)) {
                                    dispatch(setSelectedLabels([...selectedLabels, label]));
                                    dispatch(setTaskItemParams({ labels: [...selectedLabels, label] }));
                                    dispatch(setTaskListDisplayMode('filter'));
                                }
                            }} />
                        </div>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};