document.addEventListener('DOMContentLoaded', () => {
  LoadFromDataBase(); // ejecutes when DOM is ready
});

const addErrorMessage = document.getElementsByClassName("addError")[0];
const loadErrorMessage = document.getElementsByClassName("loadError")[0]


// taskContainer
const taskContainer = document.getElementById('taskContainer');

document.getElementById("signOutButton").addEventListener("click",()=>{
  document.cookie ='jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.location.href = "/"
});

document.getElementById("task-form").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const taskDescription = e.target.taskText.value;
    const comment = e.target.comment.value;
    const dueDate = e.target.due_date.value;
    const res = await fetch("http://localhost:4000/api/addTask",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            taskDescription,
            comment,
            dueDate,
            done:0
        })
    });
    
    if(!res.ok) return addErrorMessage.classList.toggle("hide", false);

    if(taskDescription) createDiv(taskDescription, comment, dueDate, false);

    e.target.reset();
});

function createDiv(taskDescription, comment, dueDate, done) {

    // Create a 'div' to store the new task
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('individualTask');

    // Create a 'div' to store the new task info
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('taskDivInfo');

    // Create a 'p' to store due date
    const taskDueDate = document.createElement('p');
    if(dueDate) {    
        taskDueDate.classList.add('roundBorder', 'dueDate', 'taskInfo');
        
        taskDueDate.textContent = `Due: ${dueDate}`;
        taskInfo.prepend(taskDueDate);
    }

    // Create a 'p' to store comment
    if(comment) {
        const taskComment = document.createElement('p');
        taskComment.classList.add('roundBorder', 'taskComment', 'taskInfo');
        taskComment.textContent = comment;
        taskInfo.prepend(taskComment);
    }

    // Create a 'p' to store task name
    const taskName = document.createElement('p');
    taskName.classList.add('roundBorder', 'taskName', 'taskInfo');
    taskName.textContent = taskDescription;
    taskInfo.prepend(taskName);

    // Create a div container to hold/manage the buttons
    const taskButtons = document.createElement('div');
    taskButtons.classList.add('taskButtons');

    // Create buttons
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌ Delete';
    deleteButton.classList.add('taskButton', 'button-30');
    deleteButton.addEventListener('click', deleteTask);  
    taskButtons.prepend(deleteButton);

    const doneButton = document.createElement('button');
    doneButton.textContent = '✅ Done';
    doneButton.classList.add('taskButton', 'button-30');
    doneButton.addEventListener('click', changeTaskStateFromButton);
    taskButtons.prepend(doneButton);

    // check if is a new task or done task
    if(done) {
        taskInfo.classList.toggle('done');
        taskDiv.classList.toggle('done');
    }

    // Final div taskInfo + taskButtons
    taskInfo.addEventListener('click', changeTaskState)  
    taskDiv.prepend(taskButtons);
    taskDiv.prepend(taskInfo);
    taskContainer.prepend(taskDiv);

    // In order to obtain information about task state
    return taskDiv;
}

const changeTaskStateFromButton = event => {
    const taskButtons = event.currentTarget.parentElement;
    const individualTask = taskButtons.parentElement;
    const taskDivInfo = individualTask.querySelector('.taskDivInfo');

    taskDivInfo.classList.toggle('done');
    individualTask.classList.toggle('done');

    updateFromDataBase(taskDivInfo);
};

const changeTaskState = event => {
    const taskDivInfo = event.currentTarget
    const taskDiv = taskDivInfo.parentElement;
    
    taskDivInfo.classList.toggle('done');
    taskDiv.classList.toggle('done');

    updateFromDataBase(taskDivInfo);
};

const deleteTask = event => {
    const taskDiv = event.currentTarget.parentElement.parentElement;      
    if (taskDiv) {
        taskDiv.remove();                      
    }

    // Delete task from dataBase
    const taskInfo = taskDiv.querySelector('.taskDivInfo');

    const taskDescription = taskInfo.querySelector('.taskName').textContent;
    const comment = taskInfo.querySelector('.taskComment')?.textContent ?? "";
    const dueDateText = taskInfo.querySelector('.dueDate')?.textContent ?? "";

    deleteTaskFromDataBase(taskDescription, comment, dueDateText.replace("Due: ", ""));
};

// Order functions
const renderOrderedTasks = () => {
    order().forEach(element => taskContainer.appendChild(element))
}

const order = () => {
    const done = [];
    const toDo = [];
    taskContainer.querySelectorAll('.individualTask').forEach( element => {
        element.classList.contains('done') ? done.push(element) : toDo.push(element)
    })
    return [...toDo, ...done];
}

// dataBase functions
async function LoadFromDataBase() {
    
    const res = await fetch("http://localhost:4000/api/loadTask",{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    const data = await res.json();

    for(element of data){
        taskDescription = element.description;
        comment = element.comment ?? "";
        dueDate = element.duedate ?? "";
        done = element.done;

        console.log(comment);
        console.log(dueDate);
        createDiv(taskDescription, comment, dueDate, done);
    }
}

function updateFromDataBase() {

}

function deleteTaskFromDataBase() {

}



/*
function deleteTaskFromLocalStorage(taskDescription, comment, dueDate) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(t => 
        !(t.taskDescription === taskDescription && t.comment === comment && t.dueDate === dueDate)
    );

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateFromLocalStorage(taskDivInfo) {
    
    const taskDescription = taskDivInfo.querySelector('.taskName').textContent;
    const comment = taskDivInfo.querySelector('.taskComment')?.textContent ?? "";
    const dueDate = taskDivInfo.querySelector('.dueDate')?.textContent ?? "";
    const dueDateText = dueDate.replace("Due: ", "") ?? "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    for(t of tasks) {
        if (t.taskDescription === taskDescription && t.comment === comment && t.dueDate === dueDateText) {
            if(taskDivInfo.classList.contains('done')) {
                t.done = true;
            } else {
                t.done = false;
            }
        }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
*/