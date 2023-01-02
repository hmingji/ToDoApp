//using Serilog;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EmailNotification.Worker.Mail;
using EmailNotification.Worker.Models;
using MassTransit;
using EmailNotification.Worker.Consumer;
using EventBus.Messages.Common;

namespace EmailNotification.Worker
{
    public class Program {
        public static void Main(string[] args)
        {   
            MainAsync(args).Wait();    
        }

        private static async Task MainAsync(string[] args) 
        {
            IHost host = Host.CreateDefaultBuilder(args)
                //.UseSerilog(SeriLogger.Configure)
                .ConfigureServices((hostContext, services) =>
                {
                    Boolean isDevelopment = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") == "Development" ? true : false;
                    var configurationRoot = hostContext.Configuration;
                    services.Configure<EmailSettings>(configurationRoot.GetSection("EmailSettings"));

                    if (Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") != "Development") {
                        services.PostConfigure<EmailSettings>(option => {
                            option.ApiKey=Environment.GetEnvironmentVariable("MJ_APIKEY_PUBLIC")!;
                            option.ApiSecret=Environment.GetEnvironmentVariable("MJ_APIKEY_PRIVATE")!;
                            option.FromAddress=Environment.GetEnvironmentVariable("FROM_ADDRESS")!;
                            option.FromName=Environment.GetEnvironmentVariable("FROM_NAME")!;
                            option.EmailTemplateID=long.Parse(Environment.GetEnvironmentVariable("EMAIL_TEMPLATE_ID")!);
                        });
                    };

                    services.AddSingleton<IMailService, MailService>();
                    services.AddMassTransit(config => {
                        config.AddConsumer<TaskReminderConsumer>();
                        config.UsingRabbitMq((ctx, cfg) => {
                            cfg.Host(isDevelopment ? configurationRoot["EventBusSettings:HostAddress"]: Environment.GetEnvironmentVariable("RABBITMQ_HOSTADDRESS"));
                            cfg.ReceiveEndpoint(EventBusConstants.TaskReminderQueue, c => {
                                c.ConfigureConsumer<TaskReminderConsumer>(ctx);
                            });
                        });
                    });
                    //services.AddHostedService<Worker>();
                })
                .Build();
            
            await host.RunAsync();
        }
    }

    
}

