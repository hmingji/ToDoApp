import { Box, Drawer, } from "@mui/material";
import { resetTaskItemParams } from "../../../features/ToDoList/taskItemSlice";
import useTaskItems from "../../hooks/useTaskItems";
import { useAppDispatch } from "../../store/configureStore";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useMediaQuery } from "usehooks-ts";
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckIcon from '@mui/icons-material/Check';
import SideBarMenuItem from "./components/SideBarMenuItem";
import FilterDropdownMenu from "./components/FilterDropdownMenu";

interface Props {
    open: boolean,
    displayMode: string,
    handleDisplayModeChange: (mode: string) => void,
    darkMode: boolean
}

export default function SideBar({ open, displayMode, handleDisplayModeChange, darkMode }: Props) {
    const { completedTaskQuantity, incompleteTaskQuantity } = useTaskItems();
    const dispatch = useAppDispatch();
    const matches = useMediaQuery('(min-width: 918px)');

    return (
        <Drawer
            variant={(matches) ? 'persistent' : 'temporary'}
            open={open}   
        >
            <Box
                sx={{ 
                    width: 320, 
                    mt: 10, 
                    mx: '1rem',
                }}
                position='sticky'
            >
                <SideBarMenuItem
                    icon={<ListAltIcon fontSize='small' />}
                    title="TO DO LIST"
                    isSelected={displayMode === 'toDoList'}
                    quantity={incompleteTaskQuantity}
                    onClickHandler={() => {
                        dispatch(resetTaskItemParams());
                        handleDisplayModeChange('toDoList');
                    }}
                />

                <SideBarMenuItem
                    icon={<CheckIcon fontSize='small' />}
                    title="COMPLETED"
                    isSelected={displayMode === 'completed'}
                    quantity={completedTaskQuantity}
                    onClickHandler={() => {
                        dispatch(resetTaskItemParams());
                        handleDisplayModeChange('completed');
                    }}
                />

                <SideBarMenuItem
                    icon={<FilterAltIcon fontSize='small' />}
                    title="FILTERS"
                    isSelected={displayMode === 'filter'}
                    onClickHandler={() => {
                        handleDisplayModeChange('filter');
                    }}
                />

                <FilterDropdownMenu 
                    ifMenuOpen={displayMode === 'filter'} 
                    darkMode={darkMode} 
                />
            </Box>         
        </Drawer>
    )
}