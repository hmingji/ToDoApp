using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Coravel.Invocable;
using EventBus.Messages.Events;
using MassTransit;
using Microsoft.Extensions.Logging;
using ToDoTask.API.Entities;
using ToDoTask.API.Repositories.Interfaces;

namespace ToDoTask.API.ScheduledJobs
{
    public class SendReminderEvents : IInvocable
    {
        private ITaskItemRepositories _taskItemRepositories;
        private IPublishEndpoint _publishEndpoint;
        private IMapper _mapper;
        private ILogger<SendReminderEvents> _logger;

        public SendReminderEvents(ITaskItemRepositories taskItemRepositories, IPublishEndpoint publishEndpoint, IMapper mapper, ILogger<SendReminderEvents> logger)
        {
            _taskItemRepositories = taskItemRepositories;
            _publishEndpoint = publishEndpoint;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task Invoke()
        {
            DateTime taskDueDate = DateTime.Now.AddDays(2);
            List<TaskItem> tasksToRemind = await _taskItemRepositories.GetTaskItemsByDate(taskDueDate);
        
            if (!tasksToRemind.Any()) return;

            foreach (TaskItem task in tasksToRemind)
            {
                try 
                {
                    TaskReminderEvent eventMessage = _mapper.Map<TaskReminderEvent>(task);
                    await _publishEndpoint.Publish<TaskReminderEvent>(eventMessage);
                    _logger.LogInformation($"Event sent.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"error sending event message: {ex.Message}");
                }
            }
        }
    }
}