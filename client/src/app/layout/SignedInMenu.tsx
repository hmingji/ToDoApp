import { Button, Menu, Fade, MenuItem, Avatar, Tooltip, ListItem, Typography, ListItemText, ListItemAvatar, ListItemIcon } from "@mui/material";
import React from "react";
import { authService } from "../services/AuthService";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LogoutIcon from '@mui/icons-material/Logout';

interface Props {
    username: string | null;
}

export default function SignedInMenu({ username }: Props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title={`Account manager for ${username}`} >
                <Button 
                    onClick={handleClick}
                    sx={{ color: "white" }}
                >
                    <Avatar sx={{ bgcolor: 'grey.400', height: '2rem', width: '2rem' }}>
                        <PermIdentityIcon sx={{ color: 'grey.600' }} />
                    </Avatar>
                </Button>                   
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <ListItem divider >
                    <ListItemAvatar >
                        <Avatar sx={{ bgcolor: 'grey.400', height: '2rem', width: '2rem' }}>
                            <PermIdentityIcon sx={{ color: 'grey.600' }} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText>

                        <Typography sx={{ fontSize: '0.875rem', fontColor: 'grey.300' }} > {'Account Email: '} </Typography>
                        <Typography sx={{ fontSize: '1rem' }} > {username} </Typography>
                    </ListItemText>
                </ListItem>

                <MenuItem onClick={() => authService.logout()}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}