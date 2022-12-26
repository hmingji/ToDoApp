using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmailNotification.Worker.Models;
using Mailjet.Client;
using Mailjet.Client.Resources;
using Mailjet.Client.TransactionalEmails;
using Microsoft.Extensions.Options;

namespace EmailNotification.Worker.Mail
{
    public class MailService : IMailService
    {
        public EmailSettings _emailSettings { get; }
        public ILogger<MailService> _logger { get; }

        public MailService(IOptions<EmailSettings> mailSettings, ILogger<MailService> logger)
        {
            _emailSettings = mailSettings.Value;
            _logger = logger;
        }

        public async Task<bool> SendEmail(Email email) 
        {
            MailjetClient client = new MailjetClient(
                _emailSettings.ApiKey,
                _emailSettings.ApiSecret
            );

            MailjetRequest request = new MailjetRequest
            {
                Resource = Send.Resource
            };

            var mjEmail = new TransactionalEmailBuilder()
                .WithFrom(new SendContact(_emailSettings.FromAddress, _emailSettings.FromName))
                .WithSubject(email.Subject)
                .WithHtmlPart(email.Body)
                .WithTo(new SendContact(email.To))
                .Build();
            
            var response = await client.SendTransactionalEmailAsync(mjEmail);
            _logger.LogInformation(String.Format("response: {0}", response));
            //_logger.LogInformation("Email sent.");

            if (response.Messages.Length == 1) return true;

            //_logger.LogError("Email sending failed");

            return false;
        }        
    }
}