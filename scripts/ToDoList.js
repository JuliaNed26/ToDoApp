import { Task } from "./Task.js";
export class ToDoList {
    constructor(tasks) {
        this._tasks = tasks;
        this._currentId = tasks.length == 0 ? 0 : tasks.sort(task => task.id)[tasks.length - 1].id + 1;
    }
    get tasks() {
        return this._tasks;
    }
    addTask(text) {
        let newTask = new Task(this._currentId, text, false);
        this._tasks.push(newTask);
        this._currentId++;
        return newTask;
    }
    removeTask(id) {
        this._tasks = this._tasks.filter(task => task.id != id);
    }
    changeCompletionOfTask(id) {
        let taskToComplete = this._tasks.find(task => task.id === id);
        if (taskToComplete == undefined) {
            console.log(`Task with id ${id} was not found`);
            return;
        }
        console.log(taskToComplete, id);
        taskToComplete.completed = !taskToComplete.completed;
    }
    getActiveTasks() {
        return this._tasks.filter(task => !task.completed);
    }
    getCompletedTasks() {
        return this._tasks.filter(task => task.completed);
    }
}
