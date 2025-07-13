import { Task } from "./Task.js";

export class ToDoList {
    private _tasks: Task[];
    private _currentId: number;
    
    constructor(tasks: Task[]) {
        this._tasks = tasks;
        this._currentId = tasks.length == 0 ? 0 : tasks.sort(task => task.id)[tasks.length - 1].id + 1;
    }

    public get tasks()
    {
        return this._tasks;
    }

    public addTask(text: string): Task
    {
        let newTask: Task = new Task(this._currentId, text, false);
        this._tasks.push(newTask);
        this._currentId++;
        return newTask;
    }

    public removeTask(id: number): void
    {
        this._tasks = this._tasks.filter(task => task.id != id);
    }

    public changeCompletionOfTask(id: number): void
    {
        let taskToComplete: Task | undefined = this._tasks.find(task => task.id === id);

        if(taskToComplete == undefined)
        {
            console.log(`Task with id ${id} was not found`);
            return;
        }

        console.log(taskToComplete, id)
        taskToComplete.completed = !taskToComplete.completed;
    }

    public getActiveTasks(): Task[]
    {
        return this._tasks.filter(task => !task.completed);
    }

    public getCompletedTasks(): Task[]
    {
        return this._tasks.filter(task => task.completed);
    }
}