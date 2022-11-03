using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ToDoTask.API.Entities;
using ToDoTask.API.Repositories.Interfaces;
using ToDoTask.API.RequestHelpers;
using ToDoTask.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using ToDoTask.API.Repositories;

namespace ToDoTask.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize("ClientIdPolicy")]

    public class ToDoTaskController : ControllerBase
    {
        private readonly ITaskItemRepositories _repository;

        public ToDoTaskController(ITaskItemRepositories repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("{userName}", Name = "GetTaskItems")]
        [ProducesResponseType(typeof(List<TaskItem>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<TaskItem>>> GetTaskItems(string userName, [FromQuery] TaskItemParams taskItemParams)
        {
            var taskItems = new List<TaskItem>(await _repository.GetTaskItems(userName)).AsQueryable()
                .Sort(taskItemParams.OrderBy)
                .Search(taskItemParams.SearchTerm)
                .Filter(taskItemParams.Priorities, taskItemParams.Labels, taskItemParams.dueDate, taskItemParams.Status)
                .ToList<TaskItem>();
            if (taskItems.Count == 0 || taskItems == null) return Ok(new List<TaskItem>());
            
            return Ok(taskItems);
        }

        [HttpGet("filters/{userName}", Name = "GetFilters")]
        [ProducesResponseType(typeof(List<string>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<List<string>>> GetFilters(string userName)
        {
            var filters = await _repository.GetFilters(userName);
            
            return Ok(filters);
        }

        [HttpGet("quantity/{userName}", Name = "GetQuantity")]
        public async Task<ActionResult<TaskItemQuantity>> GetQuantity(string userName)
        {
            var quantity = await _repository.GetTaskItemQuantity(userName);
            
            return new TaskItemQuantity
                {
                    CompleteTaskQuantity = quantity.CompleteTaskQuantity ,
                    IncompleteTaskQuantity = quantity.IncompleteTaskQuantity,
                }
            ;
        }

        [HttpPost]
        [ProducesResponseType(typeof(IEnumerable<TaskItem>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<TaskItem>>> CreateTaskItem([FromBody] TaskItem taskItem)
        {
            var result = await _repository.CreateTaskItem(taskItem);
            if (result) return CreatedAtRoute("GetTaskItems", new { userName = taskItem.Assignee }, taskItem);
            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }

        [HttpPut]
        [ProducesResponseType(typeof(TaskItem), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<TaskItem>> UpdateTaskItem([FromBody] TaskItem taskItem)
        {
            var result = await _repository.UpdateTaskItem(taskItem);
            if (result) return Ok(taskItem);
            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }

        [HttpDelete("{id}", Name = "DeleteTaskItem")]
        [ProducesResponseType(typeof(void), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<bool>> DeleteTaskItem(int id)
        {
            return Ok(await _repository.DeleteTaskItem(id));
        }
    }
}
