using EmailNotification.Worker.Mail;
using EmailNotification.Worker.Models;

namespace EmailNotification.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IMailService _mailService;
    private readonly IConfiguration Configuration;
    private int count = 0;

    public Worker(ILogger<Worker> logger, IMailService mailService, IConfiguration configuration)
    {
        _logger = logger;
        _mailService = mailService;
        Configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(1000, stoppingToken);
            if (count < 2) {
                var email = new Email() 
                { 
                    To = (Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") == "Development") 
                            ? Configuration.GetValue<string>("TestEmail:To")!  
                            : Environment.GetEnvironmentVariable("TESTMAIL_RECEIPIENT")!,
                    Body = (Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") == "Development") 
                            ? Configuration.GetValue<string>("TestEmail:Body")!
                            : Environment.GetEnvironmentVariable("TESTMAIL_BODY")!,
                    Subject = (Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") == "Development") 
                                ? Configuration.GetValue<string>("TestEmail:Subject")!
                                : Environment.GetEnvironmentVariable("TESTMAIL_SUBJECT")!
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
            count++;
        }
    }
}
