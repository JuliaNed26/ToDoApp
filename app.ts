import { ToDoList } from "./scripts/ToDoList.js"
import { Themes, ToDoListState } from "./scripts/Enums.js";
import { EventNames, HtmlElementClassNames, HtmlElementIndexNames, HtmlElementNames, HtmlStateClassNames, LocalStorageKeys } from "./scripts/Constants.js";
import { Task } from "./scripts/Task.js";


let todoList: ToDoList;
fillLocalStorage();
configureEventListeners();
refreshTasksContent();
setTheme();


function fillLocalStorage(): void
{
    if(!localStorage.getItem(LocalStorageKeys.Tasks))
    {
        todoList = new ToDoList([]);
        localStorage.setItem(LocalStorageKeys.Tasks, JSON.stringify([]));
    }
    else
    {
        const tasks: Task[] = (JSON.parse(localStorage.getItem(LocalStorageKeys.Tasks)!) as Array<string>)
                            .map(taskJson => Task.fromJson(taskJson));
        todoList = new ToDoList(tasks);
    }

    if(!localStorage.getItem(LocalStorageKeys.Theme))
    {
        localStorage.setItem(LocalStorageKeys.Theme, Themes.Light);
    }

    localStorage.setItem(LocalStorageKeys.TasksFilterState, ToDoListState.All);
}

function configureEventListeners(): void
{
    document.querySelector(HtmlElementClassNames.ThemeToggle)!.addEventListener(EventNames.Click, changeTheme);
    document.querySelector(HtmlElementIndexNames.AddButton)!.addEventListener(EventNames.Click, addToDoItem);
    document.querySelectorAll(HtmlElementClassNames.FilterButtons)
                .forEach(button => button.addEventListener(EventNames.Click, showTasks));
    document.querySelectorAll(HtmlElementClassNames.ToDoItem)
                .forEach(item => addEventListenersForToDoItem(item));
}

function setTheme(): void 
{
    let body: HTMLBodyElement = document.querySelector(HtmlElementNames.Body)!;
    let currentTheme: Themes = getCurrentTheme();

    switch(currentTheme)
    {
        case Themes.Dark:
            body.classList.add(HtmlStateClassNames.DarkMode);
            break;
        case Themes.Light:
            body.classList.remove(HtmlStateClassNames.DarkMode);
            break;
    }
}

function changeTheme(): void
{
    let currentTheme: Themes = getCurrentTheme();
    switch(currentTheme)
    {
        case Themes.Dark:
            localStorage.setItem(LocalStorageKeys.Theme, Themes.Light);
            break;
        case Themes.Light:
            localStorage.setItem(LocalStorageKeys.Theme, Themes.Dark);
            break;
    }

    setTheme();
}

function getCurrentTheme(): Themes
{
    let currentThemeString: string | null = localStorage.getItem(LocalStorageKeys.Theme);
    if(!currentThemeString)
    {
        throw new Error("Theme was not set");
    }

    switch(currentThemeString)
    {
        case Themes.Dark:
            return Themes.Dark;
        case Themes.Light:
            return Themes.Light;
        default:
            throw new Error(`Can not parse theme ${currentThemeString}`);
    }
}

function addToDoItem(): void
{
    const todoInput: HTMLInputElement = document.querySelector(HtmlElementIndexNames.ToDoInput)!;
    const taskText: string = todoInput.value;

    todoList.addTask(taskText);

    refreshTasksContent();
    todoInput.value = '';
}

function completeTask(event: Event): void
{
    const targetElement: HTMLElement = event.currentTarget as HTMLElement;
    todoList.changeCompletionOfTask(parseInt(targetElement.id));
    refreshTasksContent();
}

function deleteTask(event: Event): void
{
    const targetElement: HTMLElement = event.currentTarget as HTMLElement;
    const taskElement: HTMLElement = targetElement.parentNode as HTMLElement;

    todoList.removeTask(parseInt(taskElement.id));

    refreshTasksContent();
    event.stopPropagation();
}

function showTasks(event: Event): void
{
    let state: ToDoListState = ToDoListState.All;
    const targetElement: HTMLElement = event.currentTarget as HTMLElement;

    switch(targetElement.id)
    {
        case ToDoListState.Active.toLowerCase():
            state = ToDoListState.Active;
            break;
        case ToDoListState.Completed.toLowerCase():
            state = ToDoListState.Completed;
            break;
        case ToDoListState.All.toLowerCase():
            state = ToDoListState.All;
            break;
    }

    localStorage.setItem(LocalStorageKeys.TasksFilterState, state);
    makeFilterBtnActive(state);
    refreshTasksContent();
}

function makeFilterBtnActive(state: ToDoListState): void
{
    const filterBtns = document.querySelectorAll(HtmlElementClassNames.FilterButtons);
    filterBtns.forEach(btn => 
    {
        if(btn.id === state.toLowerCase())
        {
            btn.classList.add(HtmlStateClassNames.ActiveButtonState);
        }
        else
        {
            btn.classList.remove(HtmlStateClassNames.ActiveButtonState);
        }
    });
}


function refreshTasksContent(): void
{
    const todoListSelector : Element = document.querySelector(HtmlElementIndexNames.ToDoList)!;
    todoListSelector.replaceChildren();

    let tasks: Task[] = [];

    switch(localStorage.getItem(LocalStorageKeys.TasksFilterState))
    {
        case ToDoListState.All:
            tasks = todoList.tasks;
            break;
        case ToDoListState.Active:
            tasks = todoList.getActiveTasks();
            break;
        case ToDoListState.Completed:
            tasks = todoList.getCompletedTasks();
            break;
    }
    
    tasks.forEach(task => addTaskToList(task, todoListSelector));

    const tasksToStoreInLocalStorage = tasks.length === 0 ? [] : tasks.map(task => task.toJson());
    localStorage.setItem(LocalStorageKeys.Tasks, JSON.stringify(tasksToStoreInLocalStorage));
}

function addTaskToList(task: Task, todoListSelector: Element): void
{
    if(task.text != '')
    {
        const todoItemTemplate: HTMLTemplateElement = document.querySelector(HtmlElementIndexNames.ToDoItemTemplate)!;
        const clone = document.importNode(todoItemTemplate.content, true);
        const todoItem: Element = clone.querySelector(HtmlElementClassNames.ToDoItem)!;
        const todoItemText: HTMLDivElement = todoItem.querySelector(HtmlElementClassNames.ToDoItemText)!;
        todoItemText.innerText = task.text;
        todoItem.id = task.id.toString();

        const taskCheckbox: HTMLInputElement = todoItem.querySelector(HtmlElementClassNames.ToDoItemCheckbox)!;
        taskCheckbox.checked = task.completed;
        const completionSetCorrectly: boolean = !task.completed || todoItem.classList.contains(HtmlStateClassNames.CompletedTask)!;
        if(!completionSetCorrectly)
        {
            todoItem.classList.toggle(HtmlStateClassNames.CompletedTask);
        }
        
        addEventListenersForToDoItem(todoItem);
        todoListSelector.appendChild(todoItem);
    }
}

function addEventListenersForToDoItem(todoItem: Element): void
{
    todoItem.addEventListener(EventNames.Click, completeTask);
    todoItem.querySelector(HtmlElementClassNames.DeleteTaskButton)!
        .addEventListener(EventNames.Click, deleteTask);
}