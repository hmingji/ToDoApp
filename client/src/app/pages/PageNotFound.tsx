import { Container } from "@mui/material";
import NotFound from "../errors/NotFound";
import PublicHeader from "../layout/Header/PublicHeader";

interface Props {
    darkMode: boolean,
    handleThemeChange: () => void;
}

export default function PageNotFound({ ...props }: Props) {
    return (
        <>
            <PublicHeader {...props} />
            
            <Container sx={{ mt: 10}}>
                <NotFound />
            </Container>  
        </>
    );
}