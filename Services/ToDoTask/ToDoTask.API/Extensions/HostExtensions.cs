using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using System;

namespace ToDoTask.API.Extensions
{
    public static class HostExtensions
    {
        public static IHost MigrateDatabase<TContext>(this IHost host, int? retry = 0)
        {
            int retryForAvailability = 0;

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var configuration = services.GetRequiredService<IConfiguration>();
                var logger = services.GetRequiredService<ILogger<TContext>>();

                try
                {
                    logger.LogInformation("Migrating postgresql databaase.");

                    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                    string connStr;

                    if (env == "Development")
                    {
                        // Use connection string from file.
                        connStr = configuration.GetValue<string>("DatabaseSettings:ConnectionString");
                    }
                    else
                    {
                        // Use connection string provided at runtime by Heroku.
                        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                        // Parse connection URL to connection string for Npgsql
                        // connUrl = connUrl.Replace("postgres://", string.Empty);
                        // var pgUserPass = connUrl.Split("@")[0];
                        // var pgHostPortDb = connUrl.Split("@")[1];
                        // var pgHostPort = pgHostPortDb.Split("/")[0];
                        // var pgDb = pgHostPortDb.Split("/")[1];
                        // var pgUser = pgUserPass.Split(":")[0];
                        // var pgPass = pgUserPass.Split(":")[1];
                        // var pgHost = pgHostPort.Split(":")[0];
                        // var pgPort = pgHostPort.Split(":")[1];

                        // connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;Trust Server Certificate=true";
                    }

                    using var connection = new NpgsqlConnection
                        (connStr);
                    
                    connection.Open();

                    using var command = new NpgsqlCommand
                    {
                        Connection = connection
                    };

                    //command.CommandText = "DROP TABLE IF EXISTS TaskItem";
                    //command.ExecuteNonQuery();

                    command.CommandText = @"CREATE TABLE IF NOT EXISTS TaskItem(Id SERIAL PRIMARY KEY,
                                                                    TaskName VARCHAR(24) NOT NULL,
                                                                    Description TEXT,
                                                                    DueDate DATE,
                                                                    Assignee TEXT,
                                                                    Status TEXT,
                                                                    Label TEXT[],
                                                                    Priority TEXT)";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 01', 'Task 01 Description', '2022-02-20', 'foo@hotmail.com', 'Incomplete', '{Task 01}', 'Low')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 02', 'Task 02 Description', '2022-02-21', 'foo@hotmail.com', 'Incomplete', '{Task 02}', 'Moderate')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 03', 'Task 03 Description', '2022-02-22', 'foo@hotmail.com', 'Incomplete', '{Task 03}', 'Critical')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 04', 'Task 04 Description', '2022-02-23', 'foo@hotmail.com', 'Incomplete', '{Task 04}', 'High')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 05', 'Task 05 Description', '2022-02-24', 'foo@hotmail.com', 'Incomplete', '{Task 05}', 'Low')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 06', 'Task 06 Description', '2022-02-25', 'foo@hotmail.com', 'Incomplete', '{Task 06}', 'High')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 07', 'Task 07 Description', '2022-02-26', 'foo@hotmail.com', 'Incomplete', '{Task 07}', 'Moderate')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 08', 'Task 08 Description', '2022-02-27', 'foo@hotmail.com', 'Incomplete', '{Task 08}', 'Critical')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 09', 'Task 09 Description', '2022-02-28', 'foo@hotmail.com', 'Incomplete', '{Task 09}', 'Moderate')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 10', 'Task 10 Description', '2022-04-15', 'foo@hotmail.com', 'Incomplete', '{Task 10}', 'Moderate')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 11', 'Task 11 Description', '2022-04-16', 'foo@hotmail.com', 'Incomplete', '{Task 11}', 'Moderate')";
                    command.ExecuteNonQuery();

                    command.CommandText = "INSERT INTO TaskItem(TaskName, Description, DueDate, Assignee, Status, Label, Priority) VALUES('Task 12', 'Task 12 Description', '2022-04-16', 'foo@hotmail.com', 'Incomplete', '{Task 12}', 'Moderate')";
                    command.ExecuteNonQuery();

                    logger.LogInformation("Migrated postgresql database.");

                }
                catch (NpgsqlException ex)
                {
                    logger.LogError(ex, "An error occured while migrating the postgresql database.");

                    if (retryForAvailability < 50)
                    {
                        retryForAvailability++;
                        System.Threading.Thread.Sleep(2000);
                        MigrateDatabase<TContext>(host, retryForAvailability);
                    }
                }

                return host;
            }
        }
    }
}
