import { Divider, IconButton, Typography, Grid, Chip, Button } from "@mui/material";
import { useRef, useState } from "react";
import { DateTime } from "luxon";
import { DesktopDatePicker } from "@mui/lab";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CSSTransition } from "react-transition-group";
import './FilterDropdownMenu.module.css';
import useTaskItems from "../../../hooks/useTaskItems";
import { useAppDispatch, useAppSelector } from "../../../store/configureStore";
import FilterChecklist from "./FilterChecklist";
import { removeTaskItemParams, resetTaskItemParams, setTaskItemParams } from "../../../../features/ToDoList/taskItemSlice";

interface Props {
    ifMenuOpen: boolean;
    darkMode: boolean;
}

export default function FilterDropdownMenu({ifMenuOpen, darkMode}: Props) {
    const filterMenuNodeRef = useRef(null);
    const { labels, priorities } = useTaskItems();
    const { taskItemParams } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();
    const [displayDate, setDisplayDate] = useState<Date | undefined | null>(undefined);
    const [datepickerOpen, setDatepickerOpen] = useState(false);
    
    function addLabelFilter(label: string) {
        if (!taskItemParams.labels.includes(label)) {
            dispatch(setTaskItemParams({ labels: [...taskItemParams.labels, label] }));
        }
    }

    function removeLabelFilter(label: string) {
        dispatch(setTaskItemParams({ labels: [...taskItemParams.labels.filter(item => item !== label)] }));
    }

    function addPriorityFilter(priority: string) {
        if (!taskItemParams.priorities.includes(priority)) {
            dispatch(setTaskItemParams({ priorities: [...taskItemParams.priorities, priority] }));
        }
    }

    function removePriorityFilter(priority: string) {
        dispatch(setTaskItemParams({ priorities: [...taskItemParams.priorities.filter(item => item !== priority)] }));
    }

    function handleDueDateSelectOnClick(dueDate: Date | null | undefined) {
        if (dueDate) {
            dispatch(setTaskItemParams({ dueDate: dueDate.toJSON().split('T')[0] }));
        } else {
            setDisplayDate(null);
            dispatch(removeTaskItemParams('dueDate'));
        }
    }

    function handleResetFilter() {
        dispatch(resetTaskItemParams());
        setDisplayDate(null);
    }

    return (
        <CSSTransition
            in={ifMenuOpen}
            nodeRef={filterMenuNodeRef}
            timeout={500}
            classNames="filter"
            unmountOnExit
        >
            <div
                ref={filterMenuNodeRef}
                style={{ width: 300, marginLeft: '1.5rem' }}
            >
                <FilterChecklist
                    buttonBaseTitle="Label"
                    menuOptions={labels}
                    selectedOptions={taskItemParams.labels}
                    handleOptionSelectOnClick={addLabelFilter}
                    handleOptionRemoveOnClick={removeLabelFilter}
                    darkMode={darkMode}
                />
                <Divider sx={{ ml: '1rem' }} />

                <FilterChecklist
                    buttonBaseTitle="Priority"
                    menuOptions={priorities}
                    selectedOptions={taskItemParams.priorities}
                    handleOptionSelectOnClick={addPriorityFilter}
                    handleOptionRemoveOnClick={removePriorityFilter}
                    darkMode={darkMode}
                />
                <Divider sx={{ ml: '1rem' }} />

                <DesktopDatePicker
                    value={displayDate}
                    onChange={(date) => {
                        setDisplayDate(date);
                        handleDueDateSelectOnClick(date);
                        setDatepickerOpen(!datepickerOpen);
                    }}
                    open={datepickerOpen}
                    clearable={true}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Grid
                            container
                            ref={inputRef}
                            direction='row'
                            justifyContent='space-between'
                            sx={{ width: 'inherit', pl: '1rem', pr: '0.5rem', pt: '0.2rem', pb: '0.2rem', alignItems: 'center' }}
                        >
                            <Grid 
                                item
                                sx={{ alignItems: 'center' }}
                            >
                                <Typography
                                    sx={{ 
                                        color: (!displayDate) ? 'text.secondary' : 'text.primary', 
                                        fontWeight: (!displayDate) ? 'normal' : 'bold', 
                                        fontSize: '0.9rem' 
                                    }}
                                >
                                    Due Date
                                </Typography>

                                {(displayDate) ? (
                                    <Chip
                                        label={DateTime.fromJSDate(new Date(displayDate)).toLocaleString(DateTime.DATE_HUGE)}
                                        onDelete={() => handleDueDateSelectOnClick(null)}
                                        size='small'
                                    />
                                ) : null}
                            </Grid>

                            <IconButton
                                onClick={() => setDatepickerOpen(!datepickerOpen)}
                            >
                                <CalendarTodayIcon sx={{ color: 'grey.500' }} />
                            </IconButton>
                        </Grid>
                    )}
                />
                <Divider sx={{ ml: '1rem' }} />

                <Button
                    onClick={() => handleResetFilter()}
                    disabled={
                        taskItemParams.labels.length === 0 && 
                        taskItemParams.priorities.length === 0 && 
                        !displayDate
                    }
                    fullWidth
                >
                    Reset 
                </Button>
            </div>
        </CSSTransition>
    );    
}