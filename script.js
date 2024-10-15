let numbering = document.getElementById('numTask');

// Toggles the strike-through style for tasks when checkbox is clicked
function toggleStrikeThrough(checkbox, taskText) {
    // If checkbox is checked, add strike-through class; otherwise, remove it
    if (checkbox.checked) {
        taskText.classList.add('strike-through');
    } else {
        taskText.classList.remove('strike-through');
    }
    saveTasksToLocalStorage();
    updateTaskCount();
}

// Load saved tasks from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
    updateTaskCount();
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.box_task').forEach(taskBox => {
        const text = taskBox.querySelector('.note_text').textContent;
        const completed = taskBox.querySelector('.readyTask').checked;
        tasks.push({ text, completed }); // Push task object to tasks array
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task
function addFunction() {
    let newTask = document.getElementById('newNote').value;

    // Alert if the input is empty
    if (newTask.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    addTaskToDOM(newTask, false);
    saveTasksToLocalStorage();

    document.getElementById('newNote').value = '';
    updateTaskCount();
}

// Function to add a task element to the DOM
function addTaskToDOM(taskTextValue, isCompleted) {
    const taskBox = document.createElement('div');
    taskBox.className = 'box_task';

    const taskContent = document.createElement('div');
    taskContent.className = 'task_content';

    const taskCheck = document.createElement('input');
    taskCheck.className = 'readyTask';
    taskCheck.type = 'checkbox';
    taskCheck.checked = isCompleted;

    // Create a paragraph element for task text
    const taskText = document.createElement('p');
    taskText.className = 'note_text';
    taskText.textContent = taskTextValue;

    // If task is completed, apply the strike-through style
    if (isCompleted) {
        taskText.classList.add('strike-through');
    }

    // Event listener for checkbox to toggle strike-through
    taskCheck.addEventListener('change', function () {
        toggleStrikeThrough(taskCheck, taskText);
    });

    const taskEdit = document.createElement('textarea');
    taskEdit.className = 'editTask';
    taskEdit.style.display = 'none';

    const btnBox = document.createElement('div');
    btnBox.className = 'btn_box';

    // Create edit button
    const buttonEdit = document.createElement("button");
    buttonEdit.className = "edit_btn";
    buttonEdit.onclick = function () {
        editFunction(buttonEdit);
    };

    const iconEdit = document.createElement("i");
    iconEdit.className = "bx bx-edit";
    buttonEdit.appendChild(iconEdit);

    // Create delete button
    const buttonDel = document.createElement("button");
    buttonDel.className = "del_btn";
    buttonDel.onclick = function () {
        taskBox.remove();
        saveTasksToLocalStorage();
        updateTaskCount();
    };

    const iconDel = document.createElement("i");
    iconDel.className = "bx bx-trash";
    buttonDel.appendChild(iconDel);

    // Append all elements together
    taskContent.appendChild(taskCheck);
    taskContent.appendChild(taskText);
    btnBox.appendChild(buttonEdit);
    btnBox.appendChild(buttonDel);
    taskBox.appendChild(taskContent);
    taskBox.appendChild(taskEdit);
    taskBox.appendChild(btnBox);

    // Add new tasks at the bottom of the task list
    const taskList = document.querySelector('.task_list');
    taskList.appendChild(taskBox);
}

// Edit function for tasks
function editFunction(buttonEdit) {
    const taskBox = buttonEdit.closest('.box_task');
    const taskText = taskBox.querySelector('.note_text');
    const taskEdit = taskBox.querySelector('.editTask');

    // Toggle edit mode
    if (taskEdit.style.display === 'none') {
        taskEdit.value = taskText.textContent;
        taskEdit.style.display = 'block';
        taskText.style.display = 'none';
        buttonEdit.innerHTML = '<i class="bx bx-check"></i>';
    } else {
        taskText.textContent = taskEdit.value;
        taskEdit.style.display = 'none';
        taskText.style.display = 'block';
        buttonEdit.innerHTML = '<i class="bx bx-edit"></i>';
        saveTasksToLocalStorage();
    }
}

// Update task count
function updateTaskCount() {
    const totalTasks = document.querySelectorAll('.box_task').length;
    const completedTasks = document.querySelectorAll('.box_task .readyTask:checked').length;

    // Calculate active tasks
    const activeTasks = totalTasks - completedTasks;

    // Update display of active tasks count
    numbering.textContent = activeTasks;
}
