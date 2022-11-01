import { Switch } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

const iconWrapperStyles = {
    backgroundColor: 'white', 
    borderRadius: '50%',
    height: '25px', 
    width: '25px', 
    transform: 'translate(0px, -3px)'
}

const darkIconStyles = {
    transform: 'translate(2px, 2px)'
}

const lightIconStyles = {
    transform: 'translate(2px, 2px)', 
    color: 'orange'
}

export default function ThemeSwitch({ darkMode, handleThemeChange }: Props) {
    return (
        <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            checkedIcon={
                <div style={iconWrapperStyles}> 
                    <DarkModeIcon fontSize="small" sx={darkIconStyles} /> 
                </div>
            }
            icon={
                <div style={iconWrapperStyles}> 
                    <LightModeIcon fontSize="small" sx={lightIconStyles} /> 
                </div> 
            }
        />
);
}