using System;

namespace ToDoTask.API.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string Assignee { get; set; }
        public string Status { get; set; }
        public string[] Label { get; set; }
        public string Priority { get; set; }
    }
}
