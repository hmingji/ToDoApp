import { Typography, Menu, MenuItem, ListItemIcon, IconButton, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Check } from "@mui/icons-material";
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import { isOverflow } from "../helpers/isOverflow";
import useGetScrollState from "../hooks/useGetScrollState";
import { scrollHorizontal } from "../helpers/scrollHorizontal";
import "./FilterChecklist.module.css";
import ScrollButton from "./ScrollButton";

interface Props {
    buttonBaseTitle: string;
    menuOptions: string[];
    selectedOptions: string[];
    handleOptionSelectOnClick: (option: string) => void;
    handleOptionRemoveOnClick: (option: string) => void;
    darkMode: boolean
}

export default function FilterChecklist({ 
    buttonBaseTitle, 
    menuOptions, 
    selectedOptions, 
    handleOptionRemoveOnClick, 
    handleOptionSelectOnClick, 
    darkMode 
}: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [overflowActive, setOverflowActive] = useState(false);
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const { scrollX, isScrollEnd } = useGetScrollState(nodeRef.current);
    
    const selectedOptionsContainerStyle: React.CSSProperties = {
        display: 'flex',
        height: '30px',
        width: '230px',
        overflowX: 'auto',
        overflowY: 'hidden',
        alignItems: 'center'
    };

    useEffect(() => {
        if (nodeRef.current) setOverflowActive(isOverflow(nodeRef.current));
    }, [setOverflowActive, selectedOptions]);

    function scrollHorizontalOnWheel(e: React.WheelEvent<HTMLDivElement>) {
        if (e.deltaY === 0) return;
        scrollHorizontal(e.currentTarget, e.deltaY);
    }

    function scrollLeftOnClick() {
        if (nodeRef.current) scrollHorizontal(nodeRef.current!, -100);
    }

    function scrollRightOnClick() {
        if (nodeRef.current) scrollHorizontal(nodeRef.current!, 100);
    }

    return (
        <>
            <Grid
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                sx={{ 
                    width: 'inherit', 
                    pl: '1rem', 
                    pr: '0.5rem', 
                    py: '0.2rem' 
                }}
            >
                <Grid item alignItems='center'>
                    <Typography
                        sx={{ 
                            color: (selectedOptions.length === 0) ? 'text.secondary' : 'text.primary', 
                            fontWeight: (selectedOptions.length === 0) ? 'normal' : 'bold', 
                            fontSize: '0.9rem' 
                        }}
                    >
                        {buttonBaseTitle}
                    </Typography>

                    {(selectedOptions.length !== 0) ? (
                        <Grid
                            container
                            alignItems='center'
                            justifyContent="space-between"
                        >
                            {(overflowActive && scrollX !== 0) ? (
                                <ScrollButton 
                                    scrollTo="left" 
                                    darkMode={darkMode} 
                                    onClick={scrollLeftOnClick} 
                                />
                            ) : null}

                            <div
                                className="selectedOptionsContainer"
                                style={selectedOptionsContainerStyle}
                                ref={nodeRef}
                                onWheel={scrollHorizontalOnWheel}
                            >
                                {selectedOptions.map(item => (
                                    <Chip
                                        key={item}
                                        label={item}
                                        onDelete={() => handleOptionRemoveOnClick(item)}
                                        size='small'
                                    />
                                ))}
                            </div>

                            {(!overflowActive || isScrollEnd) ? null : (
                                <ScrollButton 
                                    scrollTo="right" 
                                    darkMode={darkMode} 
                                    onClick={scrollRightOnClick}
                                    right="50px" 
                                />
                            )}
                        </Grid>
                    ) : null}
                </Grid>

                <IconButton onClick={(event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}>
                    <AddIcon sx={{ color: 'grey.500' }} />
                </IconButton>
            </Grid>
            
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    style: {
                        maxHeight: '15rem',
                        minWidth: '12rem'
                    }
                }}
            >
                {menuOptions.map((option) => {
                    return (
                        <MenuItem
                            key={option}
                            onClick={() => {
                                handleOptionSelectOnClick(option);
                            }}
                        >
                            <ListItemIcon>
                                {(selectedOptions.includes(option)) && <Check />}
                            </ListItemIcon>
                            {option}
                        </MenuItem>
                    )
                })}
            </Menu>   
        </>
    )
}
