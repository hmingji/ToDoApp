import { Box, IconButton } from "@mui/material";
import TaskSearch from "./TaskSearch";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
    toggleSearchOpen: () => void;
}

export default function MobileTaskSearch({ toggleSearchOpen }: Props) {
    return (
        <Box display='flex' gap='1rem'>
            <IconButton onClick={toggleSearchOpen}>
                <ArrowBackIcon />
            </IconButton>

            <TaskSearch />
        </Box>
    );
}