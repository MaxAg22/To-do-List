const errorMessage = document.getElementsByClassName("error")[0]

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

    /*
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <--- esto es clave si usás CORS
        body: JSON.stringify(data)
    });
    
    
    */
    
    // Agregar verificacón!

    if(!res.ok) return errorMessage.classList.toggle("hide", false);
});



/*
document.getElementById("login-form").addEventListener("submit",async (e)=>{
  e.preventDefault();
  const user = e.target.children.user.value;
  const password = e.target.children.password.value;
  const res = await fetch("http://localhost:4000/api/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      user,password
    })
  });
  if(!res.ok) return mensajeError.classList.toggle("escondido",false);
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})
*/

/*
document.addEventListener('DOMContentLoaded', () => {
  LoadFromLocalStorage(); // ejecutes when DOM is ready
});

// taskContainer
const taskContainer = document.getElementById('taskContainer');

const addNewTask = event => {
    event.preventDefault();
    // Retrieve the task name from the form
    const { value } = event.target.taskText;
    if(!value) return;

    // Retrieve due date from the form
    const date = event.target.due_date.value;

    // Retrieve comment from the form
    const comment = event.target.comment.value;
    
    const taskDiv = createDiv(value, comment, date, false);

    // Store in local storage
    saveTaskToLocalStorage(value, comment, date, taskDiv);
    
    event.target.reset();
};

function createDiv(title, comment, dueDate, done) {

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
    taskName.textContent = title;
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

const changeTaskState = event => {
    const taskDivInfo = event.currentTarget
    const taskDiv = taskDivInfo.parentElement;
    
    taskDivInfo.classList.toggle('done');
    taskDiv.classList.toggle('done');

    updateFromLocalStorage(taskDivInfo);
};

const changeTaskStateFromButton = event => {
    const taskButtons = event.currentTarget.parentElement;
    const individualTask = taskButtons.parentElement;
    const taskDivInfo = individualTask.querySelector('.taskDivInfo');

    taskDivInfo.classList.toggle('done');
    individualTask.classList.toggle('done');

    updateFromLocalStorage(taskDivInfo);
};

const order = () => {
    const done = [];
    const toDo = [];
    taskContainer.querySelectorAll('.individualTask').forEach( element => {
        element.classList.contains('done') ? done.push(element) : toDo.push(element)
    })
    return [...toDo, ...done];
}

const renderOrderedTasks = () => {
    order().forEach(element => taskContainer.appendChild(element))
}

const deleteTask = event => {
    const taskDiv = event.currentTarget.parentElement.parentElement;      
    if (taskDiv) {
        taskDiv.remove();                      
    }

    // Delete task from local storage
    const taskInfo = taskDiv.querySelector('.taskDivInfo');

    const title = taskInfo.querySelector('.taskName').textContent;
    const comment = taskInfo.querySelector('.taskComment')?.textContent ?? "";
    const dueDateText = taskInfo.querySelector('.dueDate')?.textContent ?? "";

    deleteTaskFromLocalStorage(title, comment, dueDateText.replace("Due: ", ""));
};


// localStorage functions
function saveTaskToLocalStorage(title, comment, dueDate, taskDiv) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    const done = taskDiv.classList.contains('done') ? true : false;

    tasks.push({ title, comment, dueDate, done });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(title, comment, dueDate) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(t => 
        !(t.title === title && t.comment === comment && t.dueDate === dueDate)
    );

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function LoadFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    let title;
    let comment;
    let dueDate;
    let done;
    for(element of tasks) {
        title = element.title;
        comment = element.comment ?? "";
        dueDate = element.dueDate ?? "";
        done = element.done;

        console.log(comment);
        console.log(dueDate);
        createDiv(title, comment, dueDate, done);
    }

    renderOrderedTasks();

}

function updateFromLocalStorage(taskDivInfo) {
    
    const title = taskDivInfo.querySelector('.taskName').textContent;
    const comment = taskDivInfo.querySelector('.taskComment')?.textContent ?? "";
    const dueDate = taskDivInfo.querySelector('.dueDate')?.textContent ?? "";
    const dueDateText = dueDate.replace("Due: ", "") ?? "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    for(t of tasks) {
        if (t.title === title && t.comment === comment && t.dueDate === dueDateText) {
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