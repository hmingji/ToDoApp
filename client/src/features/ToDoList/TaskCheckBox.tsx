import { TaskItem } from "../../app/models/TaskItem";
import { Checkbox, Tooltip } from "@mui/material";
import { useState } from "react";
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

interface Props {
    taskItem: TaskItem;
    handleStatusChange: () => void;
}

function getCheckboxColor(priority: string | undefined): React.CSSProperties {
    switch (priority) {
        case "Critical":
            return { color: 'rgb(242, 93, 90)' };
        case "High":
            return { color: 'rgb(247, 149, 99)' };
        case "Moderate":
            return { color: 'rgb(255, 196, 0)' };
        case "Low":
            return { color: 'rgb(121, 195, 98)' };
        default:
            return { color: 'rgb(183, 183, 183)' };
    }
}

export default function TaskCheckBox({ taskItem, handleStatusChange }:Props) {
    const [mouseOver, setMouseOver] = useState(false);

    return (
        <Tooltip title={(taskItem.status === "Incomplete") ? 
            "Check as completed" 
            : "Check as incomplete"}
        >
            <Checkbox
                icon={(mouseOver) ? 
                    <CheckCircleTwoToneIcon 
                        fontSize="small" 
                        sx={getCheckboxColor(taskItem.priority)} 
                    /> 
                    : <CircleTwoToneIcon 
                        fontSize="small" 
                        sx={getCheckboxColor(taskItem.priority)} 
                    />}
                checkedIcon={<CheckCircleTwoToneIcon
                    fontSize="small"
                    sx={getCheckboxColor(taskItem.priority)}
                />}
                checked={taskItem.status === "Completed" ? true : false}
                onChange={handleStatusChange}
                sx={{
                    ...getCheckboxColor(taskItem.priority),
                    p: 0,
                    m: 0,
                    pt: '0.2rem'
                }}
                size="small"
                onMouseOver={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            />
        </Tooltip>
    );
};
