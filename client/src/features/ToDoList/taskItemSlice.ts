import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { TaskItem, TaskItemParams } from "../../app/models/TaskItem";
import { TaskItemQuantity } from "../../app/models/TaskItemQuantity";
import { RootState } from "../../app/store/configureStore";

interface TaskItemState {
    taskItemsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    priorities: string[];
    labels: string[];
    taskItemParams: TaskItemParams;
    taskItemCreateMode: boolean;
    selectedLabels: string[];
    selectedPriorities: string[];
    username: string;
    taskListDisplayMode: string;
    completedTaskQuantity: number;
    incompleteTaskQuantity: number
}

const taskItemsAdapter = createEntityAdapter<TaskItem>();

function getAxiosParams(taskItemParams: TaskItemParams) {
    const params = new URLSearchParams();
    params.append('orderBy', taskItemParams.orderBy);
    if (taskItemParams.searchTerm) params.append('searchTerm', taskItemParams.searchTerm);
    if (taskItemParams.priorities.length > 0) params.append('priorities', taskItemParams.priorities.toString());
    if (taskItemParams.labels.length > 0) params.append('labels', taskItemParams.labels.toString());
    if (taskItemParams.dueDate) params.append('dueDate', taskItemParams.dueDate);

    return params;
}

export const fetchTaskItemsQuantityAsync = createAsyncThunk<TaskItemQuantity, void, { state: RootState }>(
    'taskItem/fetchTaskItemsQuantityAsync',
    async (_, thunkAPI) => {
        //const params = getAxiosParams(initParams());
        try {
            if (thunkAPI.getState().account.username) {
                const response = await agent.Task.fetchQuantity(thunkAPI.getState().account.username!);
                return response;
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchTaskItemsAsync = createAsyncThunk<TaskItem[], void, { state: RootState }>(
    'taskItem/fetchTaskItemsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().taskItem.taskItemParams);
        try {
            if (thunkAPI.getState().account.username) {
                const response = await agent.Task.list(thunkAPI.getState().account.username!, params);
                return response;
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchFilters = createAsyncThunk<string[], void, { state: RootState }>(
    'taskItem/fetchFilters',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Task.fetchFilters(thunkAPI.getState().taskItem.username);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchUserInfo = createAsyncThunk<any, void, { state: RootState }>(
    'taskItem/fetchUserInfo',
    async (_, thunkAPI) => {
        try {
            const response = await agent.User.fetchUserInfo();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

function initParams() {
    return {
        orderBy: 'name',
        labels: [],
        priorities: [],
        status: ''
    }
}

export const taskItemSlice = createSlice({
    name: 'taskItem',
    initialState: taskItemsAdapter.getInitialState<TaskItemState>({
        taskItemsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        priorities: ['Critical', 'High', 'Moderate', 'Low'],
        labels: [],
        taskItemParams: initParams(),
        taskItemCreateMode: false,
        selectedLabels: [],
        selectedPriorities: [],
        username: '',
        taskListDisplayMode: 'toDoList',
        completedTaskQuantity: 0,
        incompleteTaskQuantity: 0
    }),
    reducers: {
        setTaskItemParams: (state, action) => {
            state.taskItemsLoaded = false;
            state.taskItemParams = { ...state.taskItemParams, ...action.payload };
            console.log(state.taskItemParams);
        },
        resetTaskItemParams: (state) => {
            state.taskItemsLoaded = false;
            state.taskItemParams = initParams();
            state.selectedLabels = [];
            state.selectedPriorities = [];
            console.log(state.taskItemParams);
        },
        setTaskItem: (state, action) => {
            taskItemsAdapter.upsertOne(state, action.payload);
            state.taskItemsLoaded = false;
            state.filtersLoaded = false;
        },
        removeTaskItem: (state, action) => {
            taskItemsAdapter.removeOne(state, action.payload);
            state.taskItemsLoaded = false;
            state.filtersLoaded = false;
        },
        setTaskItemCreateMode: (state, action) => {
            state.taskItemCreateMode = action.payload;
        },
        setTaskListDisplayMode: (state, action) => {
            state.taskListDisplayMode = action.payload;
        },
        setSelectedLabels: (state, action) => {
            state.selectedLabels = [...action.payload];
        },
        setSelectedPriorities: (state, action) => {
            state.selectedPriorities = [...action.payload];
        },
        removeTaskItemParams: (state, action) => {
            state.taskItemsLoaded = false;
            switch (action.payload) {
                case 'dueDate': 
                    delete state.taskItemParams['dueDate'];
                    break;           
                case 'searchTerm': 
                    delete state.taskItemParams['searchTerm'];
                    break;
                default:
                    break;
            } 
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchTaskItemsAsync.pending, (state) => {
            state.status = 'pendingFetchTaskItems';
        });
        builder.addCase(fetchTaskItemsAsync.fulfilled, (state, action) => {
            taskItemsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.taskItemsLoaded = true;
        });
        builder.addCase(fetchTaskItemsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.labels = action.payload;
            state.filtersLoaded = true;
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.status = 'pendingUserInfo';
        });
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.username = action.payload.preferred_username;
            state.status = 'idle';
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
        builder.addCase(fetchTaskItemsQuantityAsync.pending, (state) => {
            state.status = 'pendingFetchTaskItemsQuantity';
        });
        builder.addCase(fetchTaskItemsQuantityAsync.fulfilled, (state, action) => {
            state.completedTaskQuantity = action.payload.completeTaskQuantity;
            state.incompleteTaskQuantity = action.payload.incompleteTaskQuantity;
            state.status = 'idle';
            state.taskItemsLoaded = true;
        });
        builder.addCase(fetchTaskItemsQuantityAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    })
})

export const taskItemSelector = taskItemsAdapter.getSelectors((state: RootState) => state.taskItem);

export const { setTaskItemParams, resetTaskItemParams, setTaskItem, removeTaskItem, setTaskItemCreateMode, setSelectedLabels, setSelectedPriorities, removeTaskItemParams, setTaskListDisplayMode } = taskItemSlice.actions;