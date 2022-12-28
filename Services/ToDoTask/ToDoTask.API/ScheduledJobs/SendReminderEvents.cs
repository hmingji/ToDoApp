using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coravel.Invocable;
using MassTransit;
using ToDoTask.API.Entities;
using ToDoTask.API.Repositories.Interfaces;

namespace ToDoTask.API.ScheduledJobs
{
    public class SendReminderEvents : IInvocable
    {
        private ITaskItemRepositories _taskItemRepositories;
        private IPublishEndpoint _publishEndpoint;

        public SendReminderEvents(ITaskItemRepositories taskItemRepositories, IPublishEndpoint publishEndpoint)
        {
            _taskItemRepositories = taskItemRepositories;
            _publishEndpoint = publishEndpoint;
        }

        public async Task Invoke()
        {
            DateTime taskDueDate = DateTime.Now.AddDays(2);
            List<TaskItem> tasksToRemind = await _taskItemRepositories.GetTaskItemsByDate(taskDueDate);
            
        }
    }
}