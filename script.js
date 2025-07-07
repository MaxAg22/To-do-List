// taskContainer
const taskContainer = document.getElementById('taskContainer');

const addNewTask = event => {
    event.preventDefault();
    // Tomo la descripción de la tarea
    const { value } = event.target.taskText;
    if(!value) return;

    // Tomo el due date
    const date = event.target.due_date.value;

    // Tomo el comentario
    const comment = event.target.comment.value;
    
    // Creamos un div en donde agregar la tarea
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('individualTask');

    // Creamos un div para agregar la información de la task
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('taskDivInfo');

    // Creamos otro p para la fecha
    const taskDueDate = document.createElement('p');
    if(date) {    
        taskDueDate.classList.add('roundBorder', 'dueDate', 'taskInfo');
        
        taskDueDate.textContent = `Due: ${event.target.due_date.value}`;
        taskInfo.prepend(taskDueDate);
    }

    // Creamos el ultimo p para el comentario
    if(comment) {
        const taskComment = document.createElement('p');
        taskComment.classList.add('roundBorder', 'taskComment', 'taskInfo');
        taskComment.textContent = comment;
        taskInfo.prepend(taskComment);
    }

    // Creamos un p para la tarea
    const taskName = document.createElement('p');
    taskName.classList.add('roundBorder', 'taskName', 'taskInfo');
    taskName.textContent = value;
    taskInfo.prepend(taskName);

    // Creamos otro div para los botones
    const taskButtons = document.createElement('div');
    taskButtons.classList.add('taskButtons');

    // Creamos los botones para manipular el task div
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

    // Agregamos el div final
    taskInfo.addEventListener('click', changeTaskState)
    taskDiv.prepend(taskButtons);
    taskDiv.prepend(taskInfo);
    taskContainer.prepend(taskDiv);
    
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
};
