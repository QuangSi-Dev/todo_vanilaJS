// localStorage.clear()
// Global varriable

let cplTasks = [];
let unCplTasks = [];
let cplTaskList = document.querySelector('.cpl-container ul');
let unCplTaskList = document.querySelector('.unCpl-container ul');
const addBtn = document.querySelector('#addBtn');
const updateBt = document.querySelector('#updateBtn');
const texError = document.querySelector('.txtError');
updateBt.style.display = 'none';
let addInput = document.querySelector('.todo-add input');
let indexTaskEdit = null;

function Task(id, content, status = false) {
    this.id = id;
    this.content = content;
    this.status = status; // false means:  uncompleted!
}



// end of global varriable


// Local time
var today = new Date();
var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
date = date.toString();

document.querySelector('.local-time').innerHTML = date;
// end of  local time

// generate id
const uniq = function () {
    let uniq = 'id' + (new Date()).getTime();
    return uniq;
}
// add task

let addTask = function () {
    const contentAdd = document.querySelector('.todo-add input').value;
    if (!contentAdd) {
        texError.style.display = 'block'; // check validate input
        return;
    }
    const newTask = new Task(uniq(), contentAdd);
    unCplTasks.push(newTask);
    saveData();
    renderUnCplTasks();
    // clear input
    texError.style.display = 'none';
    document.querySelector('.todo-add input').value = '';
}


// window.addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//         const contentAdd = document.querySelector('.todo-add input').value;
//         if (!contentAdd) return;
//         addTask();

//         event.preventDefault();
//     }
// });

addBtn.addEventListener('click', addTask);
// end of add task
// render Completed tasks
let renderUnCplTasks = function () {
    let listTask = document.querySelector('.unCpl-container ul');
    listTask.innerHTML = '';
    for (let i = 0; i < unCplTasks.length; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<div class"item">${unCplTasks[i].content}</div><div class="idTask">${unCplTasks[i].id}</div><button class=""><i class="fa fa-trash delete"></i></button><button><i class="fa fa-check check"></i></button><button ><i class="fa fa-edit" id="edit"></i></button>`;
        li.classList.add('unCompletedItem')
        listTask.appendChild(li);
    }
}
let renderCplTasks = function () {
    let listTask = document.querySelector('.cpl-container ul');
    listTask.innerHTML = '';
    for (let i = 0; i < cplTasks.length; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<div class"item">${cplTasks[i].content}</div><div class="idTask">${cplTasks[i].id}</div><button class=""><i class="fa fa-trash delete"></i></button>`;
        li.classList.add('completedItem')
        cplTaskList.appendChild(li);
    }
}

//  Lưu trữ
const saveData = function () {
    const CompletedTasksJson = JSON.stringify(cplTasks)
    localStorage.setItem('CompletedTasksJson', CompletedTasksJson);
    const UncompletedTasksJson = JSON.stringify(unCplTasks)
    localStorage.setItem('UncompletedTasksJson', UncompletedTasksJson);
}

// Load trang
let getData = function () {
    let UncompletedTasksJson = localStorage.getItem('UncompletedTasksJson');
    let CompletedTasksJson = localStorage.getItem('CompletedTasksJson');
    if (UncompletedTasksJson) {
        unCplTasks = JSON.parse(UncompletedTasksJson);
        unCplTasks = unCplTasks.map(task => new Task(task.id, task.content, false));
    }
    renderUnCplTasks(UncompletedTasksJson);
    if (CompletedTasksJson) {
        cplTasks = JSON.parse(CompletedTasksJson);
        cplTasks = cplTasks.map(task => new Task(task.id, task.content, true));
    }
    renderCplTasks();
}
getData();


//delete Task
function deleteCheck(event) {
    const item = event.target;
    //DELETE TODO
    if (item.classList[2] == 'delete') {
        //animation
        const task = item.parentElement.parentElement;

        let idTask = task.querySelector('.idTask').innerHTML;
        let index = unCplTasks.findIndex((task) => task.id === idTask);
        if (index !== -1) {
            unCplTasks.splice(index, 1);
            saveData();
            renderUnCplTasks();
        } else {
            let index = cplTasks.findIndex((task) => task.id === idTask);
            cplTasks.splice(index, 1);
            saveData();
            renderCplTasks();
        }
    }
}

unCplTaskList.addEventListener('click', deleteCheck);

cplTaskList.addEventListener('click', deleteCheck);

// check task

function completeCheck(e) {
    const item = e.target;
    if (item.classList.contains('check')) {
        console.log(item.classList.contains('check'));
        item.classList.toggle("cplCheck");
        item.parentElement.parentElement.classList.toggle('borderCplCheck');
        const task = item.parentElement.parentElement;

        let idTask = task.querySelector('.idTask').innerHTML;
        let index = unCplTasks.findIndex((task) => task.id === idTask);
        cplTasks.push(new Task(unCplTasks[index].id, unCplTasks[index].content, true));
        unCplTasks.splice(index, 1);
        saveData();
        setTimeout(renderUnCplTasks, 300)
        renderCplTasks();

    }
}

function editTask(e) {
    const item = e.target
    if (item.id == 'edit') {
        addBtn.style.display = 'none';
        updateBt.style.display = 'block';
        const task = item.parentElement.parentElement;
        let idTask = task.querySelector('.idTask').innerHTML;
        let index = unCplTasks.findIndex((task) => task.id === idTask);
        addInput.value = unCplTasks[index].content;
        indexTaskEdit = index;
        addInput.focus();

    }
}

function updateTask() {
    const contentAdd = addInput.value;
    let index = indexTaskEdit;
    console.log(index);
    if (!contentAdd) return;
    unCplTasks[index].content = contentAdd;
    saveData();
    renderUnCplTasks();
    addBtn.style.display = 'block';
    updateBt.style.display = 'none';
    indexTaskEdit = null;
    addInput.value = '';
};
updateBt.addEventListener('click', updateTask);

unCplTaskList.addEventListener('click', completeCheck);
unCplTaskList.addEventListener('click', editTask);