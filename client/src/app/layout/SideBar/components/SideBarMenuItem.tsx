import { Button, Grid, Typography } from "@mui/material";
import { ReactNode } from "react"

interface Props {
    icon: ReactNode;
    title: string;
    quantity?: number;
    isSelected: boolean;
    onClickHandler: () => void;
}

export default function SideBarMenuItem({
    icon, 
    title, 
    quantity, 
    isSelected, 
    onClickHandler
}: Props) {
    
    return (
        <Button
            onClick={onClickHandler}
            sx={{ 
                backgroundColor: isSelected ? 'rgba(25, 118, 220, 0.2)' : 'transparent', 
                "&:hover": { backgroundColor: 'rgba(25, 118, 210, 0.2)' } 
            }}
            fullWidth
        >
            <Grid 
                container 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                sx={{}}
            >
                <Grid 
                    item
                    display="flex" 
                    alignItems="center" 
                >
                    {icon}

                    <Typography 
                        variant='inherit' 
                        sx={{ pl: '0.7rem' }}
                    >
                        {title}
                    </Typography>
                </Grid>

                {quantity !== undefined && (
                    <Typography 
                        variant='inherit' 
                        sx={{ pr: '0.7rem' }}
                    >
                        {quantity}
                    </Typography>
                )}
            </Grid>
        </Button>
    );
}