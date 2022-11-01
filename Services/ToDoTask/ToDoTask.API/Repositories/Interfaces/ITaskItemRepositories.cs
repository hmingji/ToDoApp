using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoTask.API.Entities;

namespace ToDoTask.API.Repositories.Interfaces
{
    public interface ITaskItemRepositories
    {
        Task<List<TaskItem>> GetTaskItems(string userName);
        Task<bool> UpdateTaskItem(TaskItem task);
        Task<bool> DeleteTaskItem(int id);
        Task<bool> CreateTaskItem(TaskItem task);
        Task<List<string>> GetFilters(string userName);
        Task<TaskItemQuantity> GetTaskItemQuantity(string userName);
    }
}
