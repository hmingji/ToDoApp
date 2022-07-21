import { Box, Divider, Drawer, IconButton, Typography, Grid, Chip, Button } from "@mui/material";
import { useState } from "react";
import { removeTaskItemParams, setSelectedLabels, setSelectedPriorities, setTaskItemParams, resetTaskItemParams } from "../../features/ToDoList/taskItemSlice";
import useTaskItems from "../hooks/useTaskItems";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import ButtonBaseWithMultiSelect from "./ButtonBaseWithMultiSelect";
import { DateTime } from "luxon";
import { DesktopDatePicker } from "@mui/lab";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { CSSTransition } from "react-transition-group";
import { useMediaQuery } from "usehooks-ts";
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckIcon from '@mui/icons-material/Check';
import { AuthService } from "../services/AuthService";

interface Props {
    open: boolean,
    displayMode: string,
    handleDisplayModeChange: (mode: string) => void,
    authService: AuthService,
}

export default function SideBar({ open, displayMode, handleDisplayModeChange, authService }: Props) {
    const { labels, priorities, completedTaskQuantity, incompleteTaskQuantity } = useTaskItems(authService);
    const { selectedLabels, selectedPriorities } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();
    const [displayDate, setDisplayDate] = useState<Date | undefined | null>(undefined);
    const [datepickerOpen, setDatepickerOpen] = useState(false);
    const matches = useMediaQuery('(min-width: 918px)');

    function handleLabelSelectOnClick(label: string) {
        if (!selectedLabels.includes(label)) {
            dispatch(setSelectedLabels([...selectedLabels, label]));
            dispatch(setTaskItemParams({ labels: [...selectedLabels, label] }));
        }
    }

    function handleLabelDeselectOnClick(label: string) {
        dispatch(setSelectedLabels(selectedLabels.filter(item => item !== label)));
        dispatch(setTaskItemParams({ labels: [...selectedLabels.filter(item => item !== label)] }));
    }

    function handlePrioritySelectOnClick(priority: string) {
        if (!selectedPriorities.includes(priority)) {
            dispatch(setSelectedPriorities([...selectedPriorities, priority]));
            dispatch(setTaskItemParams({ priorities: [...selectedPriorities, priority] }));
        }
    }

    function handlePriorityDeselectOnClick(priority: string) {
        dispatch(setSelectedPriorities(selectedPriorities.filter(item => item !== priority)));
        dispatch(setTaskItemParams({ priorities: [...selectedPriorities.filter(item => item !== priority)] }));
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
        <Drawer
            variant={(matches) ? 'persistent' : 'persistent'}
            open={open}   
        >
            <Box
                sx={{ width: 320, display: 'flex', flexDirection: 'column', mt: 10, ml: '1rem', mr: '1rem', justifyContent: 'center' }}
                position='sticky'
            >
                <div
                    className='drawer-list-itemTitle'
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '1rem', alignItems: 'center', paddingTop: '0.2rem' }}
                >
                    <Button
                        onClick={() => handleDisplayModeChange('toDoList')}
                        sx={{ display: 'flex', backgroundColor: (displayMode === 'toDoList') ? 'rgba(25, 118, 220, 0.2)' : 'transparent', justifyContent: 'space-between', "&:hover": { backgroundColor: 'rgba(25, 118, 210, 0.2)' } }}
                        fullWidth
                    >
                        <Box display="flex">
                            <ListAltIcon fontSize='small' />
                            <Typography variant='inherit' sx={{ pl: '0.7rem' }}>TO DO LIST</Typography>
                        </Box>

                        <Box>
                            <Typography variant='inherit' sx={{ pr: '0.7rem' }}>{incompleteTaskQuantity}</Typography>
                        </Box>
                    </Button>
                </div>

                <div
                    className='drawer-list-itemTitle'
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '1rem', alignItems: 'center', paddingTop: '0.2rem' }}
                >
                    <Button
                        onClick={() => handleDisplayModeChange('completed')}
                        sx={{ display: 'flex', backgroundColor: (displayMode === 'completed') ? 'rgba(25, 118, 210, 0.2)' : 'transparent', justifyContent: 'space-between', "&:hover": { backgroundColor: 'rgba(25, 118, 210, 0.2)' } }}
                        fullWidth
                    >
                        <Box display="flex">
                            <CheckIcon fontSize='small' />
                            <Typography variant='inherit' sx={{ pl: '0.7rem' }}>COMPLETED</Typography>
                        </Box>

                        <Box>
                            <Typography variant='inherit' sx={{ pr: '0.7rem' }}>{completedTaskQuantity}</Typography>
                        </Box>
                    </Button>
                </div>

                <div
                    className='drawer-list-itemTitle'
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '1rem', alignItems: 'center', paddingTop: '0.2rem' }}
                >   
                    <Button
                        onClick={() => handleDisplayModeChange('filter')}
                        sx={{ backgroundColor: (displayMode === 'filter') ? 'rgba(25, 118, 210, 0.2)' : 'transparent', justifyContent: 'left', "&:hover": { backgroundColor: 'rgba(25, 118, 210, 0.2)'} }}
                        fullWidth
                    >
                        <FilterAltIcon fontSize='small' />
                        <Typography variant='inherit' sx={{ pl: '0.7rem' }}>FILTERS</Typography>  
                    </Button>
                </div>

                <div
                    className="filter-dropdown"
                    style={{ overflow: 'hidden' }}
                >
                    <CSSTransition
                        in={(displayMode === 'filter')}
                        timeout={500}
                        classNames="filter"
                        unmountOnExit
                    >
                        <div
                            className='filter-itemList'
                            style={{ width: 300, display: 'flex', flexDirection: 'column', marginLeft: '1.5rem', overflow: 'hidden' }}
                        >
                            <ButtonBaseWithMultiSelect
                                buttonBaseTitle="Label"
                                menuOptions={labels}
                                selectedOptions={selectedLabels}
                                handleOptionSelectOnClick={handleLabelSelectOnClick}
                                handleOptionRemoveOnClick={handleLabelDeselectOnClick}
                            />
                            <Divider sx={{ ml: '1rem' }} />

                            <ButtonBaseWithMultiSelect
                                buttonBaseTitle="Priority"
                                menuOptions={priorities}
                                selectedOptions={selectedPriorities}
                                handleOptionSelectOnClick={handlePrioritySelectOnClick}
                                handleOptionRemoveOnClick={handlePriorityDeselectOnClick}
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
                                        <Box
                                            sx={{ alignItems: 'center', justifyContent: 'start' }}
                                        >
                                            <Typography
                                                sx={{ color: (!displayDate) ? 'text.secondary' : 'text.primary', fontWeight: (!displayDate) ? 'normal' : 'bold', fontSize: '0.9rem' }}
                                            >
                                                Due Date
                                            </Typography>

                                            {(displayDate) ? (
                                                <Grid
                                                    container
                                                    direction='row'
                                                    alignItems='center'
                                                    justifyContent="space-between"
                                                >
                                                    <Chip
                                                        label={DateTime.fromJSDate(new Date(displayDate)).toLocaleString(DateTime.DATE_HUGE)}
                                                        onDelete={() => handleDueDateSelectOnClick(null)}
                                                        size='small'
                                                    />
                                                </Grid>
                                            ) : null}
                                        </Box>

                                        <IconButton
                                            onClick={() => setDatepickerOpen(!datepickerOpen)}
                                        >
                                            <CalendarTodayIcon sx={{ color: 'grey.500' }} />
                                        </IconButton>
                                    </Grid>
                                )
                                }
                            />
                            <Divider sx={{ ml: '1rem' }} />

                            <Button
                                onClick={() => handleResetFilter()}
                                disabled={selectedLabels.length === 0 && selectedPriorities.length === 0 && !displayDate}
                            > Reset </Button>

                        </div>
                    </CSSTransition>
                </div>
            </Box>         
        </Drawer>
    )
}