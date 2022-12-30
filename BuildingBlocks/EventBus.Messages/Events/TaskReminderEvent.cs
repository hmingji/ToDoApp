using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventBus.Messages.Events
{
    public class TaskReminderEvent : IntegrationBaseEvent
    {
        public string TaskName { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string Assignee { get; set; }
        public string Status { get; set; }
        public string[] Label { get; set; }
        public string Priority { get; set; }
    }
}