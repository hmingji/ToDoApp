//using Serilog;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EmailNotification.Worker.Mail;
using EmailNotification.Worker.Models;

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
                    var configurationRoot = hostContext.Configuration;
                    services.Configure<EmailSettings>(configurationRoot.GetSection("EmailSettings"));

                    if (Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") != "Development") {
                        services.PostConfigure<EmailSettings>(option => {
                            option.ApiKey=Environment.GetEnvironmentVariable("MJ_APIKEY_PUBLIC")!;
                            option.ApiSecret=Environment.GetEnvironmentVariable("MJ_APIKEY_PRIVATE")!;
                            option.FromAddress=Environment.GetEnvironmentVariable("FROM_ADDRESS")!;
                            option.FromName=Environment.GetEnvironmentVariable("FROM_NAME")!;
                        });
                    };

                    services.AddSingleton<IMailService, MailService>();
                    services.AddHostedService<Worker>();
                })
                .Build();
            
            await host.RunAsync();
        }
    }

    
}

