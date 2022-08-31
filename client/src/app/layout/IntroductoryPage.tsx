import { Button, Grid, Typography } from "@mui/material";
import { AuthService } from "../services/AuthService";

interface Props {
    authService: AuthService;
}

export default function IntroductoryPage({ authService }: Props ) {
    return (
        <Grid container flexDirection='column' sx={{ mt: 25, mb: 8 }}>
            <Grid item sx={{mb: 2}}>
                <Typography variant='h2' sx={{ mb: 8 }} align='center'>A TO-DO WEB APPS</Typography>
                <Typography variant='subtitle2' sx={{ mb: 1 }} align='center'>This application is built with intention to self-learn web development. Tech stacks involved include react, asp.net.</Typography>
                <Typography variant='subtitle2' align='center'>Source code could be found at github.</Typography> 
            </Grid>

            <Button variant="contained" onClick={() => authService.signinRedirect()} sx={{ width: '10rem', display: 'flex', margin: '0 auto', mb: 5 }}>Start</Button>

            <Grid item sx={{ justifyContent: 'center', display: 'flex'}}>
                <img src="/images/apps-layout.JPG" alt="" style={{ width: '100%', boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px'}} />
            </Grid>
        </Grid>
    );

}