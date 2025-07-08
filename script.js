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
    
    // Create a 'div' to store the new task
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('individualTask');

    // Create a 'div' to store the new task info
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('taskDivInfo');

    // Create a 'p' to store due date
    const taskDueDate = document.createElement('p');
    if(date) {    
        taskDueDate.classList.add('roundBorder', 'dueDate', 'taskInfo');
        
        taskDueDate.textContent = `Due: ${event.target.due_date.value}`;
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
    taskName.textContent = value;
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

    // Final div taskInfo + taskButtons
    taskInfo.addEventListener('click', changeTaskState)
    taskDiv.prepend(taskButtons);
    taskDiv.prepend(taskInfo);
    taskContainer.prepend(taskDiv);

    // Store in local storage
    saveTaskToLocalStorage(value, comment, taskDueDate.textContent);
    
    event.target.reset();
};

const changeTaskState = event => {
    const taskDivInfo = event.currentTarget
    const taskDiv = taskDivInfo.parentElement;
    
    taskDivInfo.classList.toggle('done');
    taskDiv.classList.toggle('done');
};

const changeTaskStateFromButton = event => {
    const taskButtons = event.currentTarget.parentElement;
    const individualTask = taskButtons.parentElement;
    const taskDivInfo = individualTask.querySelector('.taskDivInfo');

    taskDivInfo.classList.toggle('done');
    individualTask.classList.toggle('done');
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
    const comment = taskInfo.querySelector('.taskComment').textContent;
    const dueDateText = taskInfo.querySelector('.dueDate').textContent;

    deleteTaskFromLocalStorage(title, comment, dueDateText);
};

function saveTaskToLocalStorage(title, comment, dueDate) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ title, comment, dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function deleteTaskFromLocalStorage(title, comment, dueDate) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(t => 
        !(t.title === title && t.comment === comment && t.dueDate === dueDate)
    );

    console.log(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

