const taskModel = require("../model/taskModel.js");
const {
  isValidObjectId,
  isValid,
  isEmpty,
  isValidDate,
} = require("../validations/validator.js"); // Importing Validators

//---------------------------------------[1st Api => Creating To-Do List]-------------------------------------------//

const createToDoList = async function (req, res) {
  try {
    const body = req.body;
    let { title, date, toDoList } = body;

    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "Title is mandatory!" });
    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "The input string cannot be empty!" });
    title = title
      .trim()
      .split(" ")
      .filter((x) => x)
      .join(" ");

    if (date) {
      if (!isValid(date))
        return res.status(400).send({
          status: false,
          message: "The input string cannot be empty!",
        });
      if (!isValidDate(date))
        return res.status(400).send({
          status: false,
          msg: "Date must be in the correct format(YYYY-MM-DD)!",
        });
    }

    const create = await taskModel.create(body);
    return res.status(201).send({
      status: true,
      message: "List successfully created!",
      data: create,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



//-------------------------------[2nd Api => Fetching To-Do List details by path params]-----------------------------//

const getToDoListById = async function (req, res) {
  try {
    let taskId = req.params.taskId;

    if (!isValidObjectId(taskId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Task ID in the params!" });
    let task = await taskModel.findOne({ _id: taskId, isDeleted: false });
    if (!task)
      return res
        .status(404)
        .send({ status: false, message: "Task not found!" });

    res.status(200).send({
      status: true,
      message: `The 'To-Do-List' of ${task.title} is as follows:`,
      data: task.toDoList,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



//----------------------------[3rd Api => Fetching Task list by query params]--------------------------------//

const getTaskList = async function (req, res) {
  try {
    const taskQuery = req.query;
    const filter = { isDeleted: false }; // Object Manupulation
    const { title, date } = taskQuery; 

    if (!isEmpty(taskQuery))
      return res
        .status(400)
        .send({ status: false, msg: "Please provide atleast one param!" });

    if (title) {
      if (!isValid(title)) {
        return res
          .status(400)
          .send({ status: false, msg: "Title is invalid!" });
      } else {
        filter.title = title.trim();
      }
    }
    if (date) {
      if (!isValid(date)) {
        return res.status(400).send({ status: false, msg: "Date is invalid!" });
      } else {
        filter.date = date.trim();
      }
    }

    const taskList = await taskModel
      .find(filter)
      .select({ title: 1, date: 1, toDoList: 1 });

    if (taskList.length === 0)
      return res.status(400).send({ status: false, msg: "No task found!" });

    const sortedTasks = taskList.sort((a, b) => a.name.localeCompare(b.name)); // Sorting in Alphabetical Order

    res.status(200).send({ status: true, message: "Task list", sortedTasks });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};



//--------------------------------------[4th Api => Updating Task details]-----------------------------------------//

const updateTask = async function (req, res) {
  try {
    let taskId = req.params.taskId;
    if (!isValidObjectId(taskId))
      return res.status(400).send({ status: false, msg: "TaskId is invalid!" });

    const body = req.body;
    let { title, date } = body;
    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    let task = await taskModel.findOne({ _id: taskId, isDeleted: false });
    if (!task)
      return res
        .status(404)
        .send({ status: false, message: "Task not found!" });

    if (!(title || date))
      return res
        .status(400)
        .send({ status: false, msg: "Please provide valid input to update!" });

    if (title) {
      if (!isValid(title))
        return res
          .status(400)
          .send({ status: false, msg: "Please enter title!" });
    }

    if (date) {
      if (!isValid(date))
        return res
          .status(400)
          .send({ status: false, msg: "Please enter date!" });
    }

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: taskId },
      { $set: { title, date, deletedAt: new Date() } },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: "Task updated successfully!",
      updatedTask,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



//-------------------------------------[5th Api => Updating To-Do List Item]----------------------------------------//

const updateListItem = async function (req, res) {
  try {
    let taskId = req.params.taskId;
    if (!isValidObjectId(taskId))
      return res.status(400).send({ status: false, msg: "TaskId is invalid!" });

    const body = req.body;
    let { itemToBeFound, updateItem } = body;

    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!itemToBeFound)
      return res.status(400).send({
        status: false,
        message: "The item you wish to update needs to be present!",
      });

    if (!updateItem)
      return res.status(400).send({
        status: false,
        message: "The newly updated task needs to be present!",
      });

    let task = await taskModel.findOne({ _id: taskId, isDeleted: false });
    if (!task)
      return res
        .status(404)
        .send({ status: false, message: "Task not found!" });

    let list = task.toDoList;
    if (list.length === 0)
      return res
        .status(400)
        .send({ status: false, message: "Cannnot update an empty list!" });

    for (let i = 0; i < list.length; i++) {
      if (list[i] == itemToBeFound) {
        list.splice(i, 1, updateItem);
        await taskModel.findOneAndUpdate({ _id: taskId }, list);
        return res
          .status(200)
          .send({ status: true, message: "Item updated successfully!" });
      }
    }

    res.status(404).send({
      status: false,
      message: "The item you wish to update was not found in your To-Do-List!",
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



//-----------------------------------[6th Api => Removing a To-Do list item]------------------------------------------//

const removeListItem = async function (req, res) {
  try {
    let taskId = req.params.taskId;
    if (!isValidObjectId(taskId))
      return res.status(400).send({ status: false, msg: "TaskId is invalid!" });

    const body = req.body;
    let { itemToBeFound } = body;

    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!itemToBeFound)
      return res.status(400).send({
        status: false,
        message: "The item you wish to remove needs to be present!",
      });

    let task = await taskModel.findOne({ _id: taskId, isDeleted: false });
    if (!task)
      return res
        .status(404)
        .send({ status: false, message: "Task not found!" });

    let list = task.toDoList;
    if (list.length === 0)
      return res
        .status(400)
        .send({ status: false, message: "Cannnot remove from an empty list!" });

    for (let i = 0; i < list.length; i++) {
      if (list[i] == itemToBeFound) {
        list.splice(i, 1);
        await taskModel.findOneAndUpdate({ _id: taskId }, list);
        return res
          .status(200)
          .send({ status: true, message: "Item removed successfully!" });
      }
    }

    res.status(404).send({
      status: false,
      message: "The item you wish to remove was not found in your To-Do-List!",
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



//---------------------------------------[7th Api => Deleting a Task]-------------------------------------------//

const deleteTaskById = async (req, res) => {
  try {
    let taskId = req.params.taskId;
    if (!isValidObjectId(taskId))
      return res.status(400).send({ status: false, msg: "TaskId is invalid!" });

    let task = await taskModel.findOne({ _id: taskId, isDeleted: false });
    if (!task)
      return res
        .status(404)
        .send({ status: false, message: "Task not found!" });

    await taskModel.findOneAndUpdate(
      { _id: taskId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    res
      .status(200)
      .send({ status: true, message: "Task has been deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



module.exports = {
  createToDoList,
  getToDoListById,
  getTaskList,
  updateTask,
  updateListItem,
  removeListItem,          // Destructuring & Exporting
  deleteTaskById,
};                   