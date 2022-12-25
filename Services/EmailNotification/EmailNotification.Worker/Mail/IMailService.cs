using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmailNotification.Worker.Models;

namespace EmailNotification.Worker.Mail
{
    public interface IMailService
    {
        Task<bool> SendEmail(Email email);
    }
}