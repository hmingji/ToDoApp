import { IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type ScrollDirection = 'left' | 'right'

interface Props {
    scrollTo: ScrollDirection;
    right?: string;
    darkMode: boolean;
    onClick: () => void;
}

export default function ScrollButton({ 
    scrollTo, 
    right, 
    darkMode,
    onClick 
}: Props) {
    function getButtonWrapperStyle(direction: ScrollDirection): React.CSSProperties {
        const baseStyle: React.CSSProperties = {
            position: 'absolute', 
            zIndex: 10, 
            backgroundColor: (darkMode) ? 'black' : 'white', 
        }
        switch (direction) {
            case 'left': 
                return {
                    ...baseStyle,
                    boxShadow: (darkMode) ? '10px 0px 10px 1px #000000' : '10px 0px 10px 1px #ffffff'
                };
            case 'right':
                return {
                    ...baseStyle,
                    right: right,
                    boxShadow: (darkMode) ? '-10px 0px 10px 1px #000000' : '-10px 0px 10px 1px #ffffff'
                };
            default: 
                return {...baseStyle};
        }
    }

    return (
        <div style={getButtonWrapperStyle(scrollTo)}>
            <IconButton size="small" onClick={onClick}>
                {(() => {
                    switch(scrollTo) {
                        case 'left':
                            return <KeyboardArrowLeftIcon fontSize="small" />;
                        case 'right':
                            return <KeyboardArrowRightIcon fontSize="small" />;
                        default:
                            return null;
                    }
                })()}
            </IconButton>
        </div>
    );
}