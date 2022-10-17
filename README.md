# To-Do List Assignment

## Overview
To do lists offer a way to increase productivity, stopping us from forgetting things, helps prioritise tasks, manage tasks effectively, use time wisely and improve time management as well as workflow.

### Key points
- Created a database named as `To-Do List Database-DB`for the assignment.
- The assignment is mainly divided in four parts :
- Create list -> To create a to-do list
- Get list -> To get the details of a to-do list
- Update list -> To update a to-do list
- Delete list -> To delete a to-do list

### Model
- Task Model
```
 { title: { mandatory, string },date: { String, default: null }, tasks: {Array, default: [] },updatedAt: {Date, default: null },deletedAt: {Date,default: null },
    isDeleted: {Boolean, default: false }
  }
```



## POST API


### POST /create
- Creating a new task by taking title, date(optional) and to-do list in request body.
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 201 for a successful request



## GET APIS


### GET /list/:taskId
- Fetching to-do list details by taking taskId in path params
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 200 for a successful request

### GET /tasks
- Fetching task details by taking title or date or both in query params
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 200 for a successful request



## PUT APIS


### PUT /task/:taskId
- Updating task details by taking taskId in path params and task details in request body
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 200 for a successful request

### PUT /listItem/:taskId
- Updating list item by taking taskId in path params and by adding itemToBeFound, updateItem keys in request body
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 200 for a successful request



## DELETE APIS


### DELETE /listItem/:taskId
- Removing list item by taking taskId in path params and by adding itemToBeFound key in request body
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 200 for a successful request

### DELETE /task/:taskId
- Deleting a task by taking taskId in path params
- Returning HTTP status 400 for an invalid request
- Returning a suitable error for a data not found
- Returning HTTP status 200 for a successful request



## Response

### Successful Response structure
```yaml
{
  status: true,
  data: {

  }
}
```
### Error Response structure
```yaml
{
  status: false,
  message: ""
}
```