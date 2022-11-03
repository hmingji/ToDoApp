using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoTask.API.Entities;
using ToDoTask.API.Repositories.Interfaces;
using ToDoTask.API.Repositories;

namespace ToDoTask.API.Repositories
{
    public class TaskItemRepositories : ITaskItemRepositories
    {
        public readonly IConfiguration _configuration;

        public TaskItemRepositories(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        private string getDbConnStr()
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            string connStr;

            if (env == "Development")
            {
                // Use connection string from file.
                return connStr = _configuration.GetValue<string>("DatabaseSettings:ConnectionString");
            }
            else
            {
                // Use connection string provided at runtime by Heroku.
                var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                // Parse connection URL to connection string for Npgsql
                connUrl = connUrl.Replace("postgres://", string.Empty);
                var pgUserPass = connUrl.Split("@")[0];
                var pgHostPortDb = connUrl.Split("@")[1];
                var pgHostPort = pgHostPortDb.Split("/")[0];
                var pgDb = pgHostPortDb.Split("/")[1];
                var pgUser = pgUserPass.Split(":")[0];
                var pgPass = pgUserPass.Split(":")[1];
                var pgHost = pgHostPort.Split(":")[0];
                var pgPort = pgHostPort.Split(":")[1];

                return connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;Trust Server Certificate=true";
            }
        }


        public async Task<List<TaskItem>> GetTaskItems(string userName)
        {
            
            using var connection = new NpgsqlConnection
                (getDbConnStr());

            List<TaskItem> taskItems = new List<TaskItem>(await connection.QueryAsync<TaskItem>("SELECT * FROM TaskItem WHERE Assignee = @UserName", new { UserName = userName }));

            return taskItems;
        }

        public async Task<bool> UpdateTaskItem (TaskItem taskItem)
        {
            using var connection = new NpgsqlConnection
                (getDbConnStr());
                
            var affected = await connection.ExecuteAsync("UPDATE TaskItem SET TaskName=@TaskName, Description=@Description, DueDate=@DueDate, Assignee=@Assignee, Status=@Status, Label=@Label, Priority=@Priority WHERE Id=@Id",
                new { TaskName = taskItem.TaskName, Description = taskItem.Description, DueDate = taskItem.DueDate, Assignee = taskItem.Assignee, Status = taskItem.Status, Label = taskItem.Label, Priority = taskItem.Priority, Id = taskItem.Id});

            if (affected == 0)
                return false;

            return true;
        }

        public async Task<bool> DeleteTaskItem(int id)
        {
            using var connection = new NpgsqlConnection
                (getDbConnStr());

            var affected = await connection.ExecuteAsync("DELETE FROM TaskItem WHERE Id = @Id", new { Id = id });

            if (affected == 0)
                return false;

            return true;
        }

        public async Task<bool> CreateTaskItem(TaskItem taskItem)
        {
            using var connection = new NpgsqlConnection
                (getDbConnStr());

            var affected = await connection.ExecuteAsync
                ("INSERT INTO TaskItem (TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES (@TaskName, @Description, @DueDate, @Assignee, @Status, @Label, @Priority)",
                new { TaskName = taskItem.TaskName, Description = taskItem.Description, DueDate = taskItem.DueDate, Assignee = taskItem.Assignee, Status = taskItem.Status, Label = taskItem.Label, Priority = taskItem.Priority });

            if (affected == 0)
                return false;

            return true;
        }

        public async Task<List<string>> GetFilters(string userName)
        {
            using var connection = new NpgsqlConnection
                (getDbConnStr());

            List<string> filters = new List<string>(await connection.QueryAsync<string>("SELECT DISTINCT(unnest(TaskItem.Label)) FROM TaskItem WHERE Assignee=@UserName", new { UserName = userName }));

            return filters;
        }

        public async Task<TaskItemQuantity> GetTaskItemQuantity(string userName)
        {
            using var connection = new NpgsqlConnection
                (getDbConnStr());
            
            IEnumerable<int> completedQuantity = await connection.QueryAsync<int>("SELECT COUNT(Id) FROM TaskItem WHERE Assignee = @UserName AND Status = @Complete", new { UserName = userName, Complete = "Completed" });
            IEnumerable<int> incompletedQuantity = await connection.QueryAsync<int>("SELECT COUNT(Id) FROM TaskItem WHERE Assignee = @UserName AND Status = @Incomplete", new { UserName = userName, Incomplete = "Incomplete" });
 
            return new TaskItemQuantity{
                CompleteTaskQuantity = completedQuantity.FirstOrDefault(), 
                IncompleteTaskQuantity = incompletedQuantity.FirstOrDefault()
            };
        }
    }
}
