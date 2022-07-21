import { TaskItem } from "../../app/models/TaskItem";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { validationSchema } from "./taskItemValidation";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { Box, Grid, Button, IconButton, TextField, InputAdornment, Menu, MenuItem, ButtonBase, Typography, Tooltip, Divider } from "@mui/material";
import AppTextInput from "../../app/components/AppTextInput";
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlagIcon from '@mui/icons-material/Flag';
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setTaskItem } from "./taskItemSlice";
import { LoadingButton, DesktopDatePicker } from "@mui/lab";
import { DateTime } from "luxon";
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import { toast } from "react-toastify";
import { AuthService } from "../../app/services/AuthService";

interface Props {
    taskItem?: TaskItem;
    cancelEdit: () => void;
    authService: AuthService;
}

const priorityOptions = [
    { value: 'Critical', color: 'red' },
    { value: 'High', color: 'orange' },
    { value: 'Moderate', color: 'yellow' },
    { value: 'Low', color: 'green' }
]

export default function TaskForm({ taskItem, cancelEdit, authService }: Props) {
    const { username } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();
    const { register, control, reset, handleSubmit, setValue, formState: { isDirty, isSubmitting}, getValues } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver<any>(validationSchema),
        shouldUnregister: false   
    });
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "label"
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [priorityFlagColor, setPriorityFlagColor] = useState<string>('grey');
    const [displayDate, setDisplayDate] = useState<string | undefined>(undefined);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
    const [editState, setEditState] = useState(true);
    //const htmlElRef = useRef<any>(null);

    const handlePriorityMenuOnClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePriorityMenuOnClose = (option: string) => {
        if (option !== "") {
            setValue("priority", option);
            setPriorityFlagColor(color => {
                switch (option) {
                    case "Critical":
                        return 'red';
                    case "High":
                        return 'orange';
                    case "Moderate":
                        return 'yellow';
                    case "Low":
                        return 'green';
                    default:
                        return 'grey';
                }
            })
        }
        setAnchorEl(null);
    }

    const handleOnChange = (value: Date) => {
        setTaskDueDate(value);
        setValue('dueDate', value, { shouldValidate: true });
    }

    async function handleSubmitData(data: FieldValues) {
        try {
            let response: TaskItem;
            if (taskItem) {
                response = await agent(authService).Task.updateTask(data);
            } else {
                response = await agent(authService).Task.createTask(data);
            }
            dispatch(setTaskItem(response));
            cancelEdit();
            toast.success('Submit successfully.');
        } catch (error: any) {
            console.log(error);
            toast.error(error);
        }
    }

    const setFocus = () => {
        var element = document.getElementById('taskForm');
        var headerOffset = 120;
        var elementPosition = element!.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        if (taskItem && !isDirty) {
            reset(taskItem);
            if (taskItem.dueDate) {
                setTaskDueDate(taskItem.dueDate);
                setValue('dueDate', taskItem.dueDate);
            }
            setPriorityFlagColor(color => {
                switch (taskItem.priority) {
                    case "Critical":
                        return 'red';
                    case "High":
                        return 'orange';
                    case "Moderate":
                        return 'yellow';
                    case "Low":
                        return 'green';
                    default:
                        return 'grey';
                }
            });
            if (taskItem.priority) setValue('priority', taskItem.priority);
            setValue('assignee', username);
            setValue('status', taskItem.status);
            setValue('id', taskItem.id);
        } else {
            setValue("assignee", username);
            setValue("status", "Incomplete");
            setValue("priority", "None");
        }
        return () => {
            if (!editState) {
                console.log("cleanning...");
                setTaskDueDate(taskItem?.dueDate);
                setPriorityFlagColor(color => {
                    switch (taskItem?.priority) {
                        case "Critical":
                            return 'red';
                        case "High":
                            return 'orange';
                        case "Moderate":
                            return 'yellow';
                        case "Low":
                            return 'green';
                        default:
                            return 'grey';
                    }
                });
            }
        }
    }, [taskItem, reset, isDirty]);

    useEffect(() => {
        if (taskDueDate) {
            setDisplayDate(DateTime.fromJSDate(new Date(taskDueDate)).toLocaleString(DateTime.DATE_HUGE));
        }
    }, [setDisplayDate, taskDueDate])

    useEffect(() => setFocus())

    return (
        <>
            <form onSubmit={handleSubmit(handleSubmitData)} >
                <Grid container display='flex' direction='column' sx={{ border: 1, borderColor: 'grey.400', borderRadius: 1, padding: 1 }} /*ref={htmlElRef}*/ id="taskForm">
                    <Grid item>
                        <AppTextInput control={control} name='taskName' placeholder='Task Title' />
                    </Grid>

                    <Grid item>
                        <AppTextInput control={control} name='description' placeholder='Task Description' multiline={true} rows={2} />
                    </Grid>

                    <Grid container gridTemplateColumns="repeat(15, 1fr)" gap={1} display='grid' >
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: '0.5rem' }} gridColumn="span 5">

                            <DesktopDatePicker
                                value={taskDueDate}
                                onChange={(date) => {
                                    handleOnChange(date!);
                                    setDisplayDate(DateTime.fromJSDate(new Date(date as Date)).toLocaleString(DateTime.DATE_HUGE));
                                    setDatePickerOpen(!datePickerOpen);
                                }}
                                open={datePickerOpen}
                                clearable={true}
                                renderInput={({ inputRef, inputProps, InputProps }) => (
                                    <Box display='flex' ref={inputRef} sx={{ border: 1, borderColor: 'grey.400', borderRadius: 1, mr: 1, height: 'fit-content' }} >
                                        <ButtonBase onClick={() => setDatePickerOpen(!datePickerOpen)} sx={{ pl: 1, pt: '0.45rem', pb: '0.45rem' }}>
                                            <CalendarTodayTwoToneIcon />
                                            {(taskDueDate) ? (<Typography sx={{ px: 1 }} >{displayDate}</Typography>) : (<Typography sx={{ px: 1, color: 'grey.500' }} >Due Date</Typography>)}
                                        </ButtonBase>
                                    </Box>
                                )
                                }
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'left', alignItem: 'top'}} gridColumn="span 7">
                            {(fields.length > 0) ? (
                                <Divider orientation="vertical" flexItem />
                            ) : null}

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: '0.5rem' }} >
                                {(fields.length > 0 && fields !== null) ? fields.map((item, index) => (
                                    <div key={item.id} >    
                                        <TextField
                                            {...register(`label[${index}]` as any)}
                                            variant="outlined"
                                            size="small"
                                            placeholder='Task Label'
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocalOfferIcon sx={{ color: 'grey.600' }} fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton className="hidden-button" size='small' onClick={() => remove(index)}>
                                                            <ClearIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                width: 150,
                                                "& .hidden-button": {
                                                    display: "none"
                                                },
                                                "&:hover .hidden-button": {
                                                    display: "flex"
                                                }
                                            }}
                                        />
                                    </div>
                                )) : null}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'right' }} gridColumn="span 3">
                            <div style={{ height: '1.4375rem' }}>
                                <Tooltip title="Add a label">
                                    <IconButton onClick={() => append('', { focusName: `label[${fields.length}]` })}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div style={{ height: '1.4375rem' }}>
                                <Tooltip title="Set task priority">
                                    <IconButton onClick={handlePriorityMenuOnClick} sx={{ color: priorityFlagColor }}>
                                        <FlagIcon sx={{ color: priorityFlagColor }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Box>

                        <Menu anchorEl={anchorEl} open={open} onClose={() => handlePriorityMenuOnClose("")}>
                            {priorityOptions.map(option => {
                                return (
                                    <MenuItem key={option.value} onClick={() => handlePriorityMenuOnClose(option.value)}>
                                        {option.value}
                                    </MenuItem>
                                )
                            })}
                        </Menu>    
                    </Grid>

                </Grid>

                <Box sx={{ display: 'inline-flex', flexDirection: 'row', marginTop: '0.25rem', gap: '0.5rem' }}>
                    <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Submit</LoadingButton>
                    <Button onClick={() => {
                        cancelEdit();
                        setEditState(false);
                    }}
                        variant='contained'
                        color='inherit'>Cancel</Button>
                </Box>
            </form>
        </>
    );
}