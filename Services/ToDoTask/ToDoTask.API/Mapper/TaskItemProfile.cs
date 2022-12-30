using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EventBus.Messages.Events;
using ToDoTask.API.Entities;

namespace ToDoTask.API.Mapper
{
    public class TaskItemProfile : Profile
    {
        public TaskItemProfile()
        {
            CreateMap<TaskItem, TaskReminderEvent>().ForMember(x => x.Id, opt => opt.Ignore()).ReverseMap();
        }        
    }
}