const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const helperText = document.querySelector('.helper-text');
const taskFilter = document.getElementById('filter');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');

loadEvents();

// let i = 1;
// let interval = setInterval(function () {
//     console.log(i);
//     i++;
// }, 1000)

// setTimeout(function () {
//     clearInterval(interval);
// }, 10000)
// let obj = { 
//     firstName: "John"
// }
// obj = JSON.stringify([1, 2, 5]);
// obj = JSON.parse(obj)

// console.log(obj);

// localStorage.setItem('jon', JSON.stringify(obj));
// localStorage.setItem('age', 45);

// console.log(localStorage);
// let jon = JSON.parse(localStorage.getItem('jon'))
// console.log(jon);

function loadEvents() {

    document.addEventListener('DOMContentLoaded', getTasks)

    taskForm.addEventListener('submit', addTask);

    taskList.addEventListener('click', removeTask);

    taskList.addEventListener('dblclick', updateTask);

    taskList.addEventListener('click', completeTask);

    clearBtn.addEventListener('click', clearAllTasks);

    taskFilter.addEventListener('input', filterTasks)
}

function getTasks() {
    const tasks = getTasksFromStorage();

    tasks.forEach(function (t) {
        addTaskForList(t);
    })
}

function addTask(e) {
    e.preventDefault();
    let val = taskInput.value.trim();
    if (val.length > 0) {

        if (hasTaskList(val)) {
            showHelperText();
        }
        else {
            addTaskForList(taskInput.value);
            addTaskToStorage(taskInput.value);
        }
    }
    taskInput.value = '';
}

function addTaskForList(taskInputValue) {
    let taskItem = document.createElement('li');
    let taskRemoveLink = document.createElement('a');
    let removeIcon = document.createElement('i');

    taskItem.className = 'collection-item';
    taskItem.textContent = taskInputValue;

    taskRemoveLink.className = 'delete-item secondary-content';
    removeIcon.classList.add('fa');
    removeIcon.classList.add('fa-remove');

    taskRemoveLink.appendChild(removeIcon);
    taskItem.appendChild(taskRemoveLink);

    taskList.appendChild(taskItem);
}

function hasTaskList(taskVal) {
    const taskItems = Array.from(taskList.children);
    const tasks = taskItems.map(function (taskItem) {
        return taskItem.textContent
    });
    return tasks.includes(taskVal);
}

function showHelperText() {
    helperText.classList.remove('hide');
    helperText.textContent = 'This task contains in task list';
    setTimeout(function () {
        helperText.classList.add('hide');
    }, 3000)
}

function updateTask(e) {
    if (e.target.classList.contains('collection-item')) {
        taskInput.value = e.target.textContent.trim();
        taskInput.focus();
        e.target.remove();
        removeTaskFromStorage(e.target.textContent.trim());
    }
}

function removeTask(e) {
    e.preventDefault();

    let clickedElement = e.target;
    if (clickedElement.parentElement.classList.contains('delete-item')) {
        removeTaskFromStorage(clickedElement.parentElement.parentElement.textContent);
        clickedElement.parentElement.parentElement.remove();
    }
}

function clearAllTasks(e) {
    e.preventDefault();
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    clearAllTasksFromStorage();
}

function filterTasks(e) {
    let text = e.target.value.trim();

    let items = Array.from(taskList.children);

    items.forEach(function (item) {
        let task = item.textContent.trim().toLowerCase();

        if (task.indexOf(text) == -1) {
            item.style.display = 'none';
        }
        else {
            item.style.display = 'block';
        }
    })
}

function completeTask(e) {

    if (e.target.classList.contains('collection-item')) {

        e.target.classList.toggle('through');

        const children = Array.from(e.target.children);

        let completed = false;
        let checkIcon = null;
        children.forEach(function (el) {
            if (el.classList.contains('fa-check')) {
                completed = true;
                checkIcon = el;
            }
        })

        if (!completed) {
            e.target.insertAdjacentHTML('beforeend', '<i class="fa fa-check green-text"></i>');
        }
        else {
            e.target.removeChild(checkIcon);
        }

    }
}

function writeToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    if (localStorage.getItem('tasks')) {
        return JSON.parse(localStorage.getItem('tasks'));
    }
    else {
        return [];
    }
}

function addTaskToStorage(task) {
    let tasks = getTasksFromStorage();

    tasks.push(task);
    writeToStorage(tasks);
}

function removeTaskFromStorage(task) {
    let tasks = getTasksFromStorage();

    let taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);
    console.log(tasks);
    writeToStorage(tasks);
}

function clearAllTasksFromStorage() {
    localStorage.removeItem('tasks');
}