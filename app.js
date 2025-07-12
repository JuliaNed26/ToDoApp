import { ToDoList } from "./scripts/ToDoList.js"
import { Themes, ToDoListState } from "./scripts/Enums.js";
import { EventNames, HtmlElementClassNames, HtmlElementIndexNames, HtmlElementNames, HtmlStateClassNames, LocalStorageKeys } from "./scripts/Constants.js";
import { Task } from "./scripts/Task.js";


let todoList;
fillLocalStorage();
configureEventListeners();
refreshTasksContent();
setTheme();


function fillLocalStorage()
{
    if(!localStorage.getItem(LocalStorageKeys.Tasks))
    {
        todoList = new ToDoList([]);
        localStorage.setItem(LocalStorageKeys.Tasks, JSON.stringify([]));
    }
    else
    {
        const tasks = JSON.parse(localStorage.getItem(LocalStorageKeys.Tasks))
                            .map(taskJson => Task.fromJson(taskJson));
        todoList = new ToDoList(tasks);
    }

    if(!localStorage.getItem(LocalStorageKeys.Theme))
    {
        localStorage.setItem(LocalStorageKeys.Theme, Themes.Light);
    }

    localStorage.setItem(LocalStorageKeys.TasksFilterState, ToDoListState.All);
}

function configureEventListeners()
{
    document.querySelector(HtmlElementClassNames.ThemeToggle).addEventListener(EventNames.Click, changeTheme);
    document.querySelector(HtmlElementIndexNames.AddButton).addEventListener(EventNames.Click, addToDoItem);
    document.querySelectorAll(HtmlElementClassNames.FilterButtons)
                .forEach(button => button.addEventListener(EventNames.Click, showTasks));
    document.querySelectorAll(HtmlElementClassNames.ToDoItem)
                .forEach(item => addEventListenersForToDoItem(item));
}

function setTheme() {
    var body = document.querySelector(HtmlElementNames.Body);
    var currentTheme = localStorage.getItem(LocalStorageKeys.Theme);
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
function changeTheme() {
    var currentTheme = localStorage.getItem(LocalStorageKeys.Theme);
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

function addToDoItem() {
    const todoInput = document.querySelector(HtmlElementIndexNames.ToDoInput);
    const taskText = todoInput.value;

    todoList.addTask(taskText);

    refreshTasksContent();
    todoInput.value = '';
}

function completeTask(){
    todoList.changeCompletionOfTask(parseInt(this.id));
    refreshTasksContent();
}

function deleteTask(event){
    const taskElement = this.parentNode;

    todoList.removeTask(taskElement.id);

    refreshTasksContent();
    event.stopPropagation();
}

function showTasks()
{
    let state = ToDoListState.All;
    switch(this.id)
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
    localStorage.setItem(LocalStorageKeys.TasksFilterState, state)
    makeFilterBtnActive(state)
    refreshTasksContent()
}

function makeFilterBtnActive(state)
{
    const filterBtns = document.querySelectorAll(HtmlElementClassNames.FilterButtons)
    filterBtns.forEach(btn => 
    {
        if(btn.id === state.toLowerCase())
        {
            btn.classList.add(HtmlStateClassNames.ActiveButtonState)
        }
        else
        {
            btn.classList.remove(HtmlStateClassNames.ActiveButtonState)
        }
    })
}


function refreshTasksContent()
{
    const todoListSelector = document.querySelector(HtmlElementIndexNames.ToDoList);
    todoListSelector.replaceChildren();
    let tasks = [];
    switch(localStorage.getItem(LocalStorageKeys.TasksFilterState))
    {
        case ToDoListState.All:
            tasks = todoList.tasks
            break;
        case ToDoListState.Active:
            tasks = todoList.getActiveTasks()
            break;
        case ToDoListState.Completed:
            tasks = todoList.getCompletedTasks()
            break;
    }
    
    tasks.forEach(task => addTaskToList(task, todoListSelector));

    var tasksToStoreInLocalStorage = tasks.length === 0 ? [] : tasks.map(task => task.toJson());
    localStorage.setItem(LocalStorageKeys.Tasks, JSON.stringify(tasksToStoreInLocalStorage));
}

function addTaskToList(task, todoListSelector){
    if(task.text != '')
    {
        var todoItemTemplate = document.querySelector(HtmlElementIndexNames.ToDoItemTemplate)
        var clone = todoItemTemplate.content.cloneNode(true)
        var todoItem = clone.querySelector(HtmlElementClassNames.ToDoItem)
        todoItem.querySelector(HtmlElementClassNames.ToDoItemText).innerText = task.text
        todoItem.id = task.id

        const taskCheckbox = todoItem.querySelector(HtmlElementClassNames.ToDoItemCheckbox)
        taskCheckbox.checked = task.completed
        const completionSetCorrectly = !task.completed || todoItem.classList.contains(HtmlStateClassNames.CompletedTask)
        if(!completionSetCorrectly)
        {
            todoItem.classList.toggle(HtmlStateClassNames.CompletedTask)
        }
        
        addEventListenersForToDoItem(todoItem);
        todoListSelector.appendChild(todoItem)
    }
}

function addEventListenersForToDoItem(todoItem)
{
    todoItem.addEventListener(EventNames.Click, completeTask);
    todoItem.querySelector(HtmlElementClassNames.DeleteTaskButton)
        .addEventListener(EventNames.Click, deleteTask);
}