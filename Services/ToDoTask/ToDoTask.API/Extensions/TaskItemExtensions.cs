using System;
using System.Collections.Generic;
using System.Linq;
using ToDoTask.API.Entities;

namespace ToDoTask.API.Extensions
{
    public static class TaskItemExtensions
    {
        public static IQueryable<TaskItem> Sort(this IQueryable<TaskItem> query, string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy)) return query.OrderBy(p => p.TaskName);

            query = orderBy switch
            {
                "priority" => query.OrderBy(p =>
                    p.Priority == "Critical" ? 1 :
                    p.Priority == "High" ? 2 :
                    p.Priority == "Moderate" ? 3 :
                    p.Priority == "Low" ? 4 : 
                    5),
                "dueDate" => query.OrderBy(p => p.DueDate),
                _ => query.OrderBy(p => p.TaskName)
            };

            return query;
        }

        public static IQueryable<TaskItem> Search(this IQueryable<TaskItem> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.TaskName.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<TaskItem> Filter(this IQueryable<TaskItem> query, string priorities, string labels, DateTime? dueDate, string status)
        {
            var priorityList = new List<string>();
            var labelList = new List<string>();

            if (!string.IsNullOrEmpty(priorities))
                priorityList.AddRange(priorities.ToLower().Split(",").ToList());

            if (!string.IsNullOrEmpty(labels))
                labelList.AddRange(labels.ToLower().Split(",").ToList());

            if (dueDate.HasValue)
            {
                Console.WriteLine(dueDate);
                query = query.Where(p => p.DueDate == dueDate);
            };

            if (!string.IsNullOrEmpty(status))
                query = query.Where(p => p.Status == status);

            query = query.Where(p => priorityList.Count == 0 || priorityList.Contains(p.Priority.ToLower()));
            query = query.Where(p => labelList.Count == 0 || labelList.Intersect(p.Label.Select(s => s.ToLowerInvariant()).ToArray()).Any());
            
            return query;
        }
    }
}
