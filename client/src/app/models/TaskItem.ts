export interface TaskItem {
    id?: number;
    taskName: string;
    description?: string;
    dueDate?: Date;
    assignee: string;
    status: string;
    label?: string[];
    priority?: string;
}

export interface TaskItemParams {
    orderBy: string;
    searchTerm?: string;
    dueDate?: string;
    priorities: string[];
    labels: string[];
    status?: string;
}