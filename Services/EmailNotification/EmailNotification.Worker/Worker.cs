using EmailNotification.Worker.Mail;
using EmailNotification.Worker.Models;

namespace EmailNotification.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IMailService _mailService;
    private int count = 0;

    public Worker(ILogger<Worker> logger, IMailService mailService)
    {
        _logger = logger;
        _mailService = mailService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(1000, stoppingToken);
            if (count < 5) {
                var email = new Email() 
                { 
                    To = Environment.GetEnvironmentVariable("TESTMAIL_RECEIPIENT"),
                    Body = Environment.GetEnvironmentVariable("TESTMAIL_BODY"),
                    Subject = Environment.GetEnvironmentVariable("TESTMAIL_SUBJECT")
                };

                try
                {
                    await _mailService.SendEmail(email);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Sending email failed", ex);
                }

                //_logger.LogInformation("Email sent.");
            }
            count++;
        }
    }
}
