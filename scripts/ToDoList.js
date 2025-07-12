import { Task } from "./Task.js";

export class ToDoList {
    #tasks;
    #currentId;
    
    constructor(tasks) {
        this.#tasks = tasks;
        this.#currentId = tasks.length == 0 ? 0 : tasks.at(-1).id;
    }

    get tasks()
    {
        return this.#tasks;
    }

    addTask(text)
    {
        var newTask = new Task(this.#currentId, text, false);
        this.#tasks.push(newTask);
        this.#currentId++;
        return newTask;
    }

    removeTask(id)
    {
        this.#tasks = this.#tasks.filter(task => task.id != id);
    }

    changeCompletionOfTask(id)
    {
        var taskToComplete = this.#tasks.find(task => task.id === id);
        console.log(taskToComplete,id)
        taskToComplete.completed = !taskToComplete.completed;
    }

    getActiveTasks()
    {
        return this.#tasks.filter(task => !task.completed);
    }

    getCompletedTasks()
    {
        return this.#tasks.filter(task => task.completed);
    }
}