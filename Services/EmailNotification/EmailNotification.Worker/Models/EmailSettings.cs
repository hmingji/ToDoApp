using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmailNotification.Worker.Models
{
    public class EmailSettings
    {
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
        public string FromAddress { get; set; }
        public string FromName { get; set; }
        public long EmailTemplateID { get; set; }
    }
}