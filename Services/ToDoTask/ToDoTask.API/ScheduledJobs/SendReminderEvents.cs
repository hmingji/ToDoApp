using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coravel.Invocable;
using EventBus.Messages.Events;
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
            if (tasksToRemind.Any()) return;
            foreach (TaskItem task in tasksToRemind)
            {
                TaskReminderEvent eventMessage = new TaskReminderEvent();
                eventMessage.To = task.Assignee;
                eventMessage.Subject = task.TaskName;
                eventMessage.Body = $"";
            }
        }
    }
}