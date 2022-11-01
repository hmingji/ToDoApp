import axios, { AxiosError, AxiosResponse } from "axios";
import { authService } from '../services/AuthService';

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
    fetchFilters: (assignee: string) => requests.get(`ToDoTask/filters/${assignee}`),
    fetchQuantity: (assignee: string) => requests.get(`ToDoTask/quantity/${assignee}`),
}

const User = {
    fetchUserInfo: () => requests.get(`${process.env.REACT_APP_AUTH_URL}connect/userinfo`)
}

axios.interceptors.request.use(config => {
    return authService.getUser().then(user => {
        if (user && user.access_token) {
            config.headers!.Authorization = `Bearer ${user.access_token}`
            return config;
        }
        return config;  
    });
});

axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep();
    return response;
}, (error: AxiosError) => {
    return Promise.reject(error.response);
});

const agent = { Task, User };

export default agent;