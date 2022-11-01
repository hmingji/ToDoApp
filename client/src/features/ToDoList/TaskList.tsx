import { Grid, Button, IconButton, Menu, MenuItem, ListItemIcon, Box, Chip, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { TaskItem } from "../../app/models/TaskItem";
import TaskCard from "./TaskCard";
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TaskForm from "./TaskForm";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setTaskItemCreateMode, setTaskItemParams } from "./taskItemSlice";
import SortIcon from '@mui/icons-material/Sort';
import { Check } from "@mui/icons-material";

interface Props {
    taskItems: TaskItem[];
}

const sortOptions = [
    { label: 'Alphabetical', value: 'alphabetical' },
    { label: 'Priority', value: 'priority' },
    { label: 'Due Date', value: 'dueDate' }
]

export default function TaskList({ taskItems }: Props) {
    const [createButtonOnHover, setCreateButtonOnHover] = useState<boolean>(false);
    const { taskItemCreateMode, taskItemParams, taskListDisplayMode } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [selectedSortOption, setSelectedSortOption] = useState<string>("");

    function handleSortMenuOnClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    if (taskItems.length === 0 && (taskItemParams.dueDate || taskItemParams.labels.length > 0 || taskItemParams.priorities.length > 0 || taskItemParams.searchTerm))
        return <Typography variant="subtitle1">Opsss.. There is no task matches. </Typography>

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                {(selectedSortOption) ? (
                    <Chip
                        variant="outlined"
                        label={"Sorted by " + selectedSortOption}
                        onDelete={() => {
                            setSelectedSortOption("");
                            dispatch(setTaskItemParams({ orderBy: 'name' }));
                        }}
                        sx={{ borderRadius: 1 }}
                    />
                ) : null}

                <Tooltip title="Sorting">
                    <IconButton onClick={handleSortMenuOnClick}>
                        <SortIcon />
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                >
                    {sortOptions.map((option) => {
                        return (
                            <MenuItem
                                key={option.value}
                                    onClick={() => {
                                        dispatch(setTaskItemParams({ orderBy: option.value }));
                                        setSelectedSortOption(option.label);
                                        setAnchorEl(null);
                                    }}
                            >
                                <ListItemIcon>
                                    {(taskItemParams.orderBy === option.value) && <Check />}
                                </ListItemIcon>
                                    {option.label}
                            </MenuItem>
                        )
                    })}
                </Menu>

            </Box>

            <Grid container rowSpacing={0.5}>
            
                {taskItems.map(taskItem => (
                    <Grid item xs={12} key={taskItem.id}>
                        <TaskCard taskItem={taskItem} key={taskItem.id} />   
                    </Grid>
                ))}

                {taskItemCreateMode &&
                    <Grid item xs={12} >
                        <TaskForm cancelEdit={() => dispatch(setTaskItemCreateMode(false))} />
                    </Grid>
                }

                {(taskListDisplayMode === 'toDoList') ? (
                    <Button
                        fullWidth
                        startIcon={createButtonOnHover ? <AddCircleIcon /> : <AddIcon />}
                        onMouseEnter={() => setCreateButtonOnHover(true)}
                        onMouseLeave={() => setCreateButtonOnHover(false)}
                        onClick={() => dispatch(setTaskItemCreateMode(true))}
                        sx={{ justifyContent: 'left' }}
                    >
                        Add Task
                    </Button>
                ) : null}       
            </Grid>
        </>
    )
}