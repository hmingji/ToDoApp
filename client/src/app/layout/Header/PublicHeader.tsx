import { Typography, Button, Grid, AppBar } from "@mui/material";
import { authService } from "../../services/AuthService";
import ThemeSwitch from "../../components/ThemeSwitch";
import { useAppSelector } from "../../store/configureStore";
import { Link, useHistory } from "react-router-dom";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function PublicHeader({ darkMode, handleThemeChange } : Props) {
    const { username } = useAppSelector(state => state.account);
    const history = useHistory();

    return (
        <AppBar
            position='fixed'
            sx={{ top: 0, left: 0, mb: 4, zIndex: (theme) => (theme.zIndex.drawer + 1), px: '1rem', py: '0.5rem' }}
        >
            <Grid container display="flex" alignItems="center" justifyContent="space-between">
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Typography
                        variant='h6'
                        sx={{ textDecoration: 'none', color: 'white' }}
                    >
                        To Do App
                    </Typography>
                </Link>
                
                <Grid item display="flex" gap="1rem">
                    <ThemeSwitch darkMode={darkMode} handleThemeChange={handleThemeChange} />
                    <Button 
                        onClick={() => username ? history.push('/todo') : authService.signinRedirect()} 
                        sx={{ color: 'white' }}
                    >
                        { username ? "Open Apps" : "Login" }
                    </Button>
                </Grid>
            </Grid>
        </AppBar>
    );
}