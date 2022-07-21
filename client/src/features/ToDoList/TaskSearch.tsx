import { debounce, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setTaskItemParams } from "./taskItemSlice";
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery } from "usehooks-ts";

export default function TaskSearch() {
    const { taskItemParams } = useAppSelector(state => state.taskItem);
    const [searchTerm, setSearchTerm] = useState(taskItemParams.searchTerm);
    const dispatch = useAppDispatch();
    const matches = useMediaQuery('(min-width: 918px)');

    const debouncedSearch = debounce((event: any) => {
        dispatch(setTaskItemParams({ searchTerm: event.target.value }))
    }, 1000)

    return (
        <TextField
            fullWidth={!matches}
            placeholder='Search tasks'
            variant='outlined'
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
            InputProps={{
                startAdornment:
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
            }}
            size="small"
            sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "text.disabled"
                },
                "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                        borderColor: "primary.light"
                    }
                },
                "& .MuiOutlinedInput-input": {
                    color: "grey.50"
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                        borderColor: "primary.light"
                    }
                },
                width: '30rem',
                zIndex: (!matches) ? 20 : 0
            }}        
        />
    )
}