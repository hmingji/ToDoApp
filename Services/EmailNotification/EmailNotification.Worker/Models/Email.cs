using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmailNotification.Worker.Models
{
    public class Email
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public Dictionary<string, object> BodyVars { get; set; }
    }
}