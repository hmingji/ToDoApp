import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
    label?: string;
    multiline?: boolean;
    rows?: number;
    type?: string;
    placeholder?: string;
}

export default function AppTextInput(props : Props) {
    const { fieldState, field } = useController({ ...props, defaultValue: '' })

    return (
        <TextField
            {...props}
            {...field}
            multiline={props.multiline}
            rows={props.rows}
            type={props.type}
            placeholder={props.placeholder}
            fullWidth
            variant='standard'
            InputProps={{ disableUnderline: true }}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />

    );
}