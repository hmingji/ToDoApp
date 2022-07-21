using System;

namespace ToDoTask.API.RequestHelpers
{
    public class TaskItemParams
    {
        public string OrderBy { get; set; }
        public string SearchTerm { get; set; }
        public string Priorities { get; set; }
        public string Labels { get; set; }
        public DateTime? dueDate { get; set; }
        public string Status { get; set; } 
    }
}
