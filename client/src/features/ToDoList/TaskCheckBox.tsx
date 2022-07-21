import { TaskItem } from "../../app/models/TaskItem";
import { Checkbox, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

interface Props {
    taskItem: TaskItem;
    handleStatusChange: () => void;
}

export default function TaskCheckBox({ taskItem, handleStatusChange }:Props) {
    const [checkBoxColor, setCheckBoxColor] = useState<string>('rgb(183, 183, 183)');
    const [mouseOver, setMouseOver] = useState(false);

    useEffect(() => {
        if (taskItem) {
            switch (taskItem.priority) {
                case "Critical":
                    setCheckBoxColor('rgb(242, 93, 90)');
                    break;
                case "High":
                    setCheckBoxColor('rgb(247, 149, 99)');
                    break;
                case "Moderate":
                    setCheckBoxColor('rgb(255, 196, 0)');
                    break;
                case "Low":
                    setCheckBoxColor('rgb(121, 195, 98)');
                    break;
                default:
                    setCheckBoxColor('rgb(183, 183, 183)');
                    break;
            }
        }
    }, [setCheckBoxColor, taskItem]);

    return (
        <Tooltip title={(taskItem.status === "Incomplete") ? "Check as completed" : "Check as incomplete"}>
            <Checkbox
                icon={(mouseOver) ? <CheckCircleTwoToneIcon fontSize="small" sx={{ color: checkBoxColor }} /> : <CircleTwoToneIcon fontSize="small" sx={{ color: checkBoxColor }} /> }
                checkedIcon={<CheckCircleTwoToneIcon
                    fontSize="small"
                    sx={{
                        color: checkBoxColor
                    }}
                />}
                checked={taskItem.status === "Completed" ? true : false}
                onChange={handleStatusChange}
                sx={{
                    color: checkBoxColor,
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
