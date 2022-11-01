import { Container } from "@mui/material";
import ToDo from "../../features/ToDoList/ToDo";
import AppHeader from "../layout/Header/AppHeader";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
    handleDrawerOpenChange: () => void;
    drawerOpen: boolean;
    isDesktop: boolean;
}

export default function MainApp({ darkMode, drawerOpen, ...props }: Props) {
    
    return (
        <>
            <AppHeader 
                darkMode={darkMode} 
                drawerOpen={drawerOpen} 
                {...props} 
            />
            
            <Container sx={{ mt: 10}}>
                <ToDo 
                    darkMode={darkMode} 
                    drawerOpen={drawerOpen} 
                />
            </Container>
        </>
    );
}