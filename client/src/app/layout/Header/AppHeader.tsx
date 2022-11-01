import { AppBar } from "@mui/material";
import DesktopAppHeader from "./DesktopAppHeader";
import MobileAppHeader from "./MobileAppHeader";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
    handleDrawerOpenChange: () => void;
    drawerOpen: boolean;
    isDesktop: boolean;
}

export default function AppHeader({ isDesktop, ...props } : Props) {
    
    return (
        <AppBar
            position='fixed'
            sx={{ top: 0, left: 0, mb: 4, zIndex: (theme) => (theme.zIndex.drawer + 1), px: '1rem', py: '0.5rem' }}
        >
            {isDesktop ? 
                <DesktopAppHeader {...props} />
            :   <MobileAppHeader {...props} />
            }
        </AppBar>
    );
}