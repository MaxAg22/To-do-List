document.addEventListener('DOMContentLoaded', () => {
  LoadFromDataBase(); // ejecutes when DOM is ready
});

const addErrorMessage = document.getElementsByClassName("addError")[0];
const loadErrorMessage = document.getElementsByClassName("loadError")[0];
const updateErrorMessage = document.getElementsByClassName("updateError")[0];
const deleteErrorMessage = document.getElementsByClassName("deleteError")[0];


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
    const data = await res.json();
    console.log("Server response: ", data);

    if(taskDescription) createDiv(taskDescription, comment, dueDate, false, data.id);

    e.target.reset();
});

function createDiv(taskDescription, comment, dueDate, done, id) {

    // Create a 'div' to store the new task
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('individualTask');

    // Create a 'div' to store the new task info
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('taskDivInfo');
    
    // Set task id in order to modify later
    taskInfo.dataset.id = id;

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
    const taskId = taskInfo.dataset.id;

    deleteTaskFromDataBase(taskId);
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

    if(!res.ok) return loadErrorMessage.classList.toggle("hide", false);
    const data = await res.json();
    console.log("Server response: ", data);

    for(element of data){
        taskDescription = element.description;
        comment = element.comment ?? "";
        dueDate = element.duedate ?? "";
        done = element.done;
        taskId = element.id;

        console.log(comment);
        console.log(dueDate);
        createDiv(taskDescription, comment, dueDate, done, taskId);
    }
    renderOrderedTasks();
}

async function updateFromDataBase(taskDivInfo) {
    const taskDescription = taskDivInfo.querySelector('.taskName').textContent;
    const comment = taskDivInfo.querySelector('.taskComment')?.textContent ?? "";
    const dueDate = taskDivInfo.querySelector('.dueDate')?.textContent ?? "";
    const dueDateText = dueDate.replace("Due: ", "") ?? "";

    const done = taskDivInfo.classList.contains('done') ? true : false;
    const id = taskDivInfo.dataset.id;

    const res = await fetch("http://localhost:4000/api/updateTask",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            taskDescription,
            comment,
            dueDateText,
            done,
            id
        })
    });

    if(!res.ok) return updateErrorMessage.classList.toggle("hide", false);
    const data = await res.json();
    console.log("Server response: ", data);
}

async function deleteTaskFromDataBase(taskId) {

    const res = await fetch("http://localhost:4000/api/deleteTask", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({taskId})
    });
        
    if(!res.ok) return deleteErrorMessage.classList.toggle("hide", false);
    const data = await res.json();
    console.log("Server response: ", data);
}