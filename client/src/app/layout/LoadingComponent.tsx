import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
    message?: string;
}

export default function LoadingComponent({ message = 'Loading...' }: Props) {
    return (
        <Backdrop open={true} invisible={false} sx={{ backgroundColor : 'white' }}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={30} color='primary' />
                <Typography variant='subtitle1' sx={{ justifyContent: 'center', position: 'fixed', top: '52%' }}>
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    )
}