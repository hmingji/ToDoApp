import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route } from 'react-router';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { useMediaQuery } from 'usehooks-ts';
import { authService } from '../services/AuthService';
import Intro from '../pages/Intro';
import SignInRedirectCallback from '../pages/SignInRedirectCallback';
import AppLoader from './AppLoader';
import SignOutRedirectCallback from '../pages/SignOutRedirectCallback';
import MainApp from '../pages/MainApp';
import PageNotFound from '../pages/PageNotFound';
import { Switch } from 'react-router-dom';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const matches = useMediaQuery('(min-width: 918px)');
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212',
      },
    },
  });

  useEffect(() => {
    if (!matches && drawerOpen) setDrawerOpen(false);
    if (matches && !drawerOpen) setDrawerOpen(true);
  }, [matches]);

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  function handleDrawerOpenChange() {
    setDrawerOpen(!drawerOpen);
  }

  const themeProps = {
    darkMode: darkMode,
    handleThemeChange: handleThemeChange,
  };

  const drawerProps = {
    drawerOpen: drawerOpen,
    handleDrawerOpenChange: handleDrawerOpenChange,
  };

  const mediaQueryProps = {
    isDesktop: matches,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ThemeProvider theme={theme}>
          <ToastContainer
            position="bottom-left"
            hideProgressBar
            theme="colored"
          />
          <CssBaseline />
          <AppLoader>
            <Switch>
              <Route exact path="/" render={() => <Intro {...themeProps} />} />
              <Route
                path="/todo"
                render={() => (
                  <MainApp
                    {...themeProps}
                    {...drawerProps}
                    {...mediaQueryProps}
                  />
                )}
              />
              <Route path="/signin-oidc" component={SignInRedirectCallback} />
              <Route
                path="/signout-callback-oidc"
                render={() => <SignOutRedirectCallback {...themeProps} />}
              />
              <Route
                path="/silent-signin"
                render={() => {
                  authService.signinSilentCallback();
                  return null;
                }}
              />
              <Route render={() => <PageNotFound {...themeProps} />} />
            </Switch>
          </AppLoader>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </LocalizationProvider>
  );
}

export default App;
