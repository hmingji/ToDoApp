import { Box, Typography, Menu, MenuItem, ListItemIcon, IconButton, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Check } from "@mui/icons-material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CSS from 'csstype';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';

interface Props {
    buttonBaseTitle: string;
    menuOptions: string[];
    selectedOptions: string[];
    handleOptionSelectOnClick: (option: string) => void;
    handleOptionRemoveOnClick: (option: string) => void;
    darkMode: boolean
}

interface Style extends CSS.Properties { }

export default function ButtonBaseWithMultiSelect({ buttonBaseTitle, menuOptions, selectedOptions, handleOptionRemoveOnClick, handleOptionSelectOnClick, darkMode }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [overflowActive, setOverflowActive] = useState<boolean>(false);
    const [scrollX, setScrollX] = useState<number>(0);
    const [scrollEnd, setScrollEnd] = useState<boolean>(false);

    const nodeRef = useRef<any>(null);

    //style to hide the horizontal overflow item, and support horizontal scroll
    const selectedOptionsContainerStyle: Style = {
        display: 'flex',
        height: '30px',
        width: '230px',
        overflowX: 'auto',
        overflowY: 'hidden',
        alignItems: 'center'
    }

    //to trigger sideScroll when user click on button
    const sideScroll = (element: HTMLDivElement, speed: number, distance: number, step: number) => {
        let scrollAmount = 0;
        
        const slideTimer = setInterval(() => {
            element.scrollLeft += step;
            scrollAmount += Math.abs(step);
            if (scrollAmount >= distance) {
                clearInterval(slideTimer);
            }
        }, speed);

        setScrollX(scrollX + step);

        if (
            Math.floor(element.scrollWidth - element.scrollLeft) <=
            element.offsetWidth
        ) {
            setScrollEnd(true);
        } else {
            setScrollEnd(false);
        }
    };

    //to detect if the element is overflow
    const checkOverflow = (textContainer: HTMLDivElement | null): boolean => {
        if (textContainer) {
            const result = textContainer.clientHeight < textContainer.scrollHeight || textContainer.clientWidth < textContainer.scrollWidth;
            return result;          
        };
        return false;
    };

    //update the overflow state upon overflow detection
    useEffect(() => {
        if (checkOverflow(nodeRef.current)) {
            setOverflowActive(true);
            return;
        }
        setOverflowActive(false);
    }, [checkOverflow]);

    //add wheel listener to handle horizontal scroll on wheel
    useEffect(() => {
        const el = nodeRef.current;
        if (el) {
            const onWheel = (e: WheelEvent) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                el!.scrollTo({
                    left: el!.scrollLeft + e.deltaY,
                    behavior: "smooth"
                });

                if (
                    Math.floor(el.scrollWidth - el.scrollLeft) <=
                    el.offsetWidth
                ) {
                    setScrollEnd(true);
                } else {
                    setScrollEnd(false);
                }
            };
            el.addEventListener("wheel", onWheel);
            console.log('added wheel listener');
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, [nodeRef.current]);

    //to tell when the items are scrolled to end or start point
    const scrollCheck = () => {
        setScrollX(nodeRef.current.scrollLeft);
        if (
            Math.floor(nodeRef.current.scrollWidth - nodeRef.current.scrollLeft) <=
            nodeRef.current.offsetWidth
        ) {
            setScrollEnd(true);
        } else {
            setScrollEnd(false);
        }
    };

    return (
        <Box
            sx={{ alignItems: 'center' }}
        >
            <Grid
                container
                direction='row'
                justifyContent='space-between'
                sx={{ width: 'inherit', pl: '1rem', pr: '0.5rem', pt: '0.2rem', pb: '0.2rem', alignItems: 'center' }}
            >
                <Box
                    sx={{ alignItems: 'center', justifyContent: 'start' }}
                >
                    <Typography
                        sx={{ color: (selectedOptions.length === 0) ? 'text.secondary' : 'text.primary', fontWeight: (selectedOptions.length === 0) ? 'normal' : 'bold', fontSize: '0.9rem' }}
                    >
                        {buttonBaseTitle}
                    </Typography>

                    {(selectedOptions.length !== 0) ? (
                        <Grid
                            container
                            direction='row'
                            alignItems='center'
                            justifyContent="space-between"
                        >
                            {(overflowActive && scrollX !== 0) ? (
                                <Grid
                                    item
                                    sx={{ position: 'absolute', zIndex: 10, backgroundColor: (darkMode) ? 'black' : 'white', boxShadow: (darkMode) ? '10px 0px 10px 1px #000000' : '10px 0px 10px 1px #ffffff' }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            sideScroll(nodeRef.current, 25, 100, -10);
                                        }}
                                    >
                                        <KeyboardArrowLeftIcon fontSize="small" />
                                    </IconButton>
                                </Grid>
                            ) : null}

                            <div
                                className="selectedOptionsContainer"
                                style={selectedOptionsContainerStyle}
                                ref={nodeRef}
                                onScroll={scrollCheck}
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

                            {(!overflowActive || scrollEnd) ? null : (
                                <Grid
                                    item
                                    sx={{ position: 'absolute', zIndex: 10, right: '50px', backgroundColor: (darkMode) ? 'black' : 'white', boxShadow: (darkMode) ? '-10px 0px 10px 1px #000000' : '-10px 0px 10px 1px #ffffff' }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            sideScroll(nodeRef.current, 25, 100, 10);
                                        }}
                                    >
                                        <KeyboardArrowRightIcon
                                            fontSize="small"
                                        />
                                    </IconButton>
                                </Grid>
                            )}
                        </Grid>
                    ) : null}

                </Box>

                <IconButton
                    onClick={(event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
                >
                    <AddIcon
                        sx={{ color: 'grey.500' }}
                    />
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
        </Box>
    )
}