import { useEffect } from "react";
import { fetchFilters, fetchTaskItemsAsync, fetchTaskItemsQuantityAsync, fetchUserInfo, taskItemSelector } from "../../features/ToDoList/taskItemSlice";
import { AuthService } from "../services/AuthService";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useTaskItems(authService: AuthService) {
    const taskItems = useAppSelector(taskItemSelector.selectAll);
    const { taskItemsLoaded, filtersLoaded, priorities, labels, username, completedTaskQuantity, incompleteTaskQuantity } = useAppSelector(state => state.taskItem);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!taskItemsLoaded && username) {
            dispatch(fetchTaskItemsAsync(authService));
            dispatch(fetchTaskItemsQuantityAsync(authService));
        }
    }, [taskItemsLoaded, dispatch, username]);

    useEffect(() => {
        if (!filtersLoaded && username) {
            dispatch(fetchFilters(authService));
        }
    }, [filtersLoaded, dispatch, username]);

    return {
        taskItems,
        taskItemsLoaded,
        filtersLoaded,
        priorities,
        labels,
        completedTaskQuantity,
        incompleteTaskQuantity
    }
}