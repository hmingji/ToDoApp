import { ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { fetchUserInfo } from "../../features/Account/accountSlice";
import { fetchTaskItemsAsync, fetchTaskItemsQuantityAsync } from "../../features/ToDoList/taskItemSlice";
import { authService } from "../services/AuthService";
import { useAppDispatch } from "../store/configureStore";
import LoadingComponent from "./LoadingComponent";

interface Props {
    children: ReactNode;
}

const modalRoot = document.getElementById('modal-root')!;

export default function AppLoader({ children }: Props) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const initApp = useCallback(async () => {
        try {
            const user = await authService.getUser();
            if (!user && location.pathname === '/todo') return authService.signinRedirect();
            if (!user) return;
            setLoading(true);
            await dispatch(fetchUserInfo());
            await dispatch(fetchTaskItemsAsync());
            await dispatch(fetchTaskItemsQuantityAsync());
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, location.pathname]);

    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp, location]);

    if (loading) return createPortal(<LoadingComponent message="Initialising app..." />, modalRoot);

    return <>{children}</>;
}