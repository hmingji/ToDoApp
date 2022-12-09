import { Button, Container, Grid, Typography } from '@mui/material';
import PublicHeader from '../layout/Header/PublicHeader';
import { authService } from '../services/AuthService';
import { introContent } from './constants/introContent';

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Intro({ ...props }: Props) {
  console.log(process.env.REACT_APP_AUTH_URL);
  return (
    <>
      <PublicHeader {...props} />

      <Container sx={{ mt: 10 }}>
        <Grid container flexDirection="column" sx={{ mt: 25, mb: 8 }}>
          <Grid item sx={{ mb: 2 }}>
            <Typography variant="h2" sx={{ mb: 8 }} align="center">
              {introContent.title}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }} align="center">
              {introContent.description}
            </Typography>

            <Typography variant="subtitle2" align="center">
              {introContent.remark}
            </Typography>
          </Grid>

          <Button
            variant="contained"
            onClick={() => authService.signinRedirect()}
            sx={{ width: '10rem', display: 'flex', margin: '0 auto', mb: 5 }}
          >
            Start
          </Button>

          <Grid item sx={{ justifyContent: 'center', display: 'flex' }}>
            <img
              src="/images/apps-layout.JPG"
              alt=""
              style={{
                width: '100%',
                boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
