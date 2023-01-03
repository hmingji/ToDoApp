import { TaskItem } from '../../app/models/TaskItem';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { validationSchema } from './taskItemValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ButtonBase,
  Typography,
  Tooltip,
} from '@mui/material';
import AppTextInput from '../../app/components/AppTextInput';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlagIcon from '@mui/icons-material/Flag';
import agent from '../../app/api/agent';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { setTaskItem } from './taskItemSlice';
import { LoadingButton } from '@mui/lab';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTime } from 'luxon';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import { toast } from 'react-toastify';

interface Props {
  taskItem?: TaskItem;
  cancelEdit: () => void;
}

const priorityOptions = [
  { value: 'Critical', color: 'red' },
  { value: 'High', color: 'orange' },
  { value: 'Moderate', color: 'yellow' },
  { value: 'Low', color: 'green' },
];

export default function TaskForm({ taskItem, cancelEdit }: Props) {
  const { username } = useAppSelector((state) => state.account);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const executeRef = useRef(false);
  const formElementRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
    getFieldState,
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver<any>(validationSchema),
    shouldUnregister: false,
  });
  const { error } = getFieldState('label');
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'label',
  });

  const handlePriorityMenuOnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePriorityMenuOnClose = (option: string) => {
    if (option !== '') {
      setValue('priority', option);
    }
    setAnchorEl(null);
  };

  const handleOnChange = (value: Date) => {
    setValue('dueDate', value, { shouldValidate: true });
  };

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: TaskItem;
      if (taskItem) {
        response = await agent.Task.updateTask(data);
      } else {
        response = await agent.Task.createTask(data);
      }
      console.log('submitting form, data: ', data);
      dispatch(setTaskItem(response));
      cancelEdit();
      toast.success('Submit successfully.');
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  }

  function scrollToView(element: HTMLFormElement) {
    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  function resetForm(taskItem: TaskItem | undefined) {
    if (taskItem) {
      console.log('reseting form, taskItem: ', taskItem);
      Object.entries(taskItem).forEach(([key, value]) => {
        if (value) {
          register(key, { value: value });
          setValue(key, value);
        }
      });
    } else {
      register('assignee', { value: username });
      register('status', { value: 'Incomplete' });
    }
  }

  function getPriorityFlagColor(priority: string) {
    switch (priority) {
      case 'Critical':
        return 'red';
      case 'High':
        return 'orange';
      case 'Moderate':
        return 'yellow';
      case 'Low':
        return 'green';
      default:
        return 'grey';
    }
  }

  useEffect(() => {
    if (executeRef.current) return;
    console.log('running reset form');
    resetForm(taskItem);
    if (formElementRef.current) scrollToView(formElementRef.current);
    executeRef.current = true;
  });

  return (
    <form onSubmit={handleSubmit(handleSubmitData)} ref={formElementRef}>
      <Grid
        container
        display="flex"
        direction="column"
        sx={{ border: 1, borderColor: 'grey.400', borderRadius: 1, padding: 1 }}
      >
        <Grid item>
          <AppTextInput
            control={control}
            name="taskName"
            placeholder="Task Title"
          />
        </Grid>

        <Grid item>
          <AppTextInput
            control={control}
            name="description"
            placeholder="Task Description"
            multiline={true}
            rows={2}
          />
        </Grid>

        <Grid
          container
          gap={1}
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
        >
          <Grid item xs={9}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: '0.5rem',
              }}
            >
              {fields.length > 0 && fields !== null
                ? fields.map((item, index) => (
                    <TextField
                      key={item.id}
                      {...register(`label[${index}]` as any)}
                      variant="outlined"
                      size="small"
                      placeholder="Task Label"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalOfferIcon
                              sx={{ color: 'grey.600' }}
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              className="hidden-button"
                              size="small"
                              onClick={() => remove(index)}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        onKeyPress: (event) => {
                          const { key } = event;
                          if (key === 'Enter') {
                            event.preventDefault();
                            event.currentTarget.blur();
                          }
                        },
                      }}
                      sx={{
                        width: 150,
                        '& .hidden-button': {
                          display: 'none',
                        },
                        '&:hover .hidden-button': {
                          display: 'flex',
                        },
                      }}
                    />
                  ))
                : null}
            </Box>
            {!!error && (
              <Typography sx={{ fontSize: '12px', color: 'rgb(211, 47, 47)' }}>
                {error.message}
              </Typography>
            )}

            <DesktopDatePicker
              value={getValues('dueDate')}
              onChange={(date) => {
                handleOnChange(date!);
                setDatePickerOpen(!datePickerOpen);
              }}
              open={datePickerOpen}
              componentsProps={{
                actionBar: {
                  actions: ['clear'],
                },
              }}
              renderInput={({ inputRef }) => (
                <Box
                  ref={inputRef}
                  sx={{
                    border: 1,
                    borderColor: 'grey.400',
                    borderRadius: 1,
                    mr: 1,
                    height: 'fit-content',
                    maxWidth: '310px',
                    mt: 1,
                  }}
                >
                  <ButtonBase
                    onClick={() => setDatePickerOpen(!datePickerOpen)}
                    sx={{
                      pl: 1,
                      py: '0.45rem',
                      width: '100%',
                      justifyContent: 'left',
                    }}
                  >
                    <CalendarTodayTwoToneIcon />

                    {getValues('dueDate') ? (
                      <Typography sx={{ px: 1 }}>
                        {DateTime.fromJSDate(
                          new Date(getValues('dueDate'))
                        ).toLocaleString(DateTime.DATE_HUGE)}
                      </Typography>
                    ) : (
                      <Typography sx={{ px: 1, color: 'grey.500' }}>
                        Due Date
                      </Typography>
                    )}
                  </ButtonBase>
                </Box>
              )}
            />
          </Grid>

          <Grid
            item
            sx={{
              display: 'flex',
              gap: '0.2rem',
              alignItems: 'flex-end',
              pb: '0.825rem',
            }}
          >
            <div style={{ height: '1.4375rem' }}>
              <Tooltip title="Add a label">
                <IconButton
                  onClick={() =>
                    append('', { focusName: `label[${fields.length}]` })
                  }
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </div>

            <div style={{ height: '1.4375rem' }}>
              <Tooltip title="Set task priority">
                <IconButton
                  onClick={handlePriorityMenuOnClick}
                  sx={{ color: getPriorityFlagColor(getValues('priority')) }}
                >
                  <FlagIcon
                    sx={{ color: getPriorityFlagColor(getValues('priority')) }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handlePriorityMenuOnClose('')}
          >
            {priorityOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handlePriorityMenuOnClose(option.value)}
              >
                {option.value}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'row',
          marginTop: '0.25rem',
          gap: '0.5rem',
        }}
      >
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          Submit
        </LoadingButton>

        <Button
          onClick={() => cancelEdit()}
          variant="contained"
          color="inherit"
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
}
