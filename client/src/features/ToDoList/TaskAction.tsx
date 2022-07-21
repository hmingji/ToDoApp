import { DeleteOutlineTwoTone, EditTwoTone } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";

interface Props {
    handleEditModeChange: () => void;
    handleDeleteOnClick: () => void;
    editMode: boolean
}

export default function TaskAction({ editMode, handleEditModeChange, handleDeleteOnClick }: Props) {
    return (
        <Grid container direction='row' justifyContent='center'>
            <Tooltip title="Edit task">
                <IconButton size='small' onClick={() => { handleEditModeChange(); }} disabled={editMode} sx={{ width: '2rem' }}>
                    <EditTwoTone fontSize="small"/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Remove task">
                <IconButton size="small" onClick={handleDeleteOnClick} disabled={editMode} sx={{ width: '2rem' }}>
                    <DeleteOutlineTwoTone fontSize="small" />
                </IconButton>
            </Tooltip>
        </Grid>
    );
};
