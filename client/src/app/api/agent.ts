import axios, { AxiosError, AxiosResponse } from "axios";
import { AuthService } from '../services/AuthService';

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Task = {
    list: (assignee: string, params?: URLSearchParams) => requests.get(`ToDoTask/${assignee}`, params),
    createTask: (task: any) => requests.post('ToDoTask', task),
    updateTask: (task: any) => requests.put('ToDoTask', task),
    deleteTask: (id: number) => requests.delete(`ToDoTask/${id}`),
    fetchFilters: (assignee: string) => requests.get(`ToDoTask/filters/${assignee}`)
}

const User = {
    fetchUserInfo: () => requests.get(`${process.env.REACT_APP_AUTH_URL}connect/userinfo`)
}

function agent(authService: AuthService) {

    axios.interceptors.request.use(config => {
        return authService.getUser().then(user => {
            if (user && user.access_token) {
                config.headers!.Authorization = `Bearer ${user.access_token}`
                return config;
            } else if (user) {
                authService.renewToken().then(renewedUser => {
                    config.headers!.Authorization = `Bearer ${renewedUser?.access_token}`
                    return config;
                })
            } else {
                return config;
            }
        });
    }, (error: AxiosError) => {
        return authService.getUser().then(user => {
            if (user && user.access_token && error.response?.status === 401) {
                return authService.renewToken().then(renewedUser => {
                    error.config.headers!.Authorization = `Bearer ${renewedUser?.access_token}`
                    error.config.baseURL = undefined;
                    return axios.request(error.config);
                });
            } else {
                return Promise.reject(error.response);
            }
        });

    });

    axios.interceptors.response.use(async response => {
        if (process.env.NODE_ENV === 'development') await sleep();
        return response;
    }, (error: AxiosError) => {
        return Promise.reject(error.response);
    });

    return {
        Task,
        User,
        authService
    }
}

export default agent;