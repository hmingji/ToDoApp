//using Serilog;

using EmailNotification.Worker.Mail;
using EmailNotification.Worker.Models;

namespace EmailNotification.Worker
{
    public class Program {
        public static void Main(string[] args)
        {
            IHost host = Host.CreateDefaultBuilder(args)
                //.UseSerilog(SeriLogger.Configure)
                .ConfigureServices(services =>
                {
                    services.Configure<EmailSettings>(c => new EmailSettings() { 
                        FromAddress= Environment.GetEnvironmentVariable("FROM_ADDRESS"),
                        FromName= Environment.GetEnvironmentVariable("FROM_NAME"),
                        ApiKey= Environment.GetEnvironmentVariable("MJ_APIKEY_PUBLIC"),
                        ApiSecret= Environment.GetEnvironmentVariable("MJ_APIKEY_PRIVATE")});
                    services.AddTransient<IMailService, MailService>();
                    services.AddHostedService<Worker>();
                })
                .Build();

            host.Run();
        }
    }
}

