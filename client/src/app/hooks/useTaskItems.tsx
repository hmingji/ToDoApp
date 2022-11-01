import { useEffect } from "react";
import { fetchFilters, fetchTaskItemsAsync, fetchTaskItemsQuantityAsync, taskItemSelector } from "../../features/ToDoList/taskItemSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useTaskItems() {
    const taskItems = useAppSelector(taskItemSelector.selectAll);
    const { taskItemsLoaded, filtersLoaded, priorities, labels, completedTaskQuantity, incompleteTaskQuantity } = useAppSelector(state => state.taskItem);
    const { username } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!taskItemsLoaded && username) {
            dispatch(fetchTaskItemsAsync());
            dispatch(fetchTaskItemsQuantityAsync());
        }
    }, [taskItemsLoaded, dispatch, username]);

    useEffect(() => {
        if (!filtersLoaded && username) {
            dispatch(fetchFilters());
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