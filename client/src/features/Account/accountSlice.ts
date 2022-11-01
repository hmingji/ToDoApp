import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

interface AccountState {
    username: string | null;
    status: string;
}

export const fetchUserInfo = createAsyncThunk<any, void, { state: RootState }>(
    'account/fetchUserInfo',
    async (_, thunkAPI) => {
        try {
            const response = await agent.User.fetchUserInfo();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

const initialState: AccountState = {
    username: null,
    status: 'idle',
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.status = 'pendingUserInfo';
        });
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.username = action.payload.preferred_username;
            console.log("get username", action.payload.preferred_username);
            state.status = 'idle';
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
    })
})