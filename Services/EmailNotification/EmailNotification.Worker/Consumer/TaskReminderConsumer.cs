using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmailNotification.Worker.Mail;
using EmailNotification.Worker.Models;
using EventBus.Messages.Events;
using MassTransit;

namespace EmailNotification.Worker.Consumer
{
    public class TaskReminderConsumer : IConsumer<TaskReminderEvent>
    {
        private readonly ILogger<TaskReminderConsumer> _logger;
        private readonly IMailService _mailService;
        
        public TaskReminderConsumer(ILogger<TaskReminderConsumer> logger, IMailService mailService)
        {
            _logger = logger;
            _mailService = mailService;
        }

        public async Task Consume(ConsumeContext<TaskReminderEvent> context)
        {
            Dictionary<string, object> bodyVars = new Dictionary<string, object>();
            bodyVars.Add("TaskName", context.Message.TaskName);
            bodyVars.Add("Description", context.Message.Description);
            bodyVars.Add("DueDate", context.Message.DueDate.ToLongDateString());

            Email email = new Email()
            {
                To = context.Message.Assignee,
                BodyVars = bodyVars,
                Subject = $"Task for {context.Message.DueDate.ToLongDateString()}"
            };

            try
            {
                await _mailService.SendEmail(email);
                _logger.LogInformation("email sent.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
            }
        }
    }
}