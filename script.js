let numbering = document.getElementById('numTask');

// Toggles the strike-through style for tasks when checkbox is clicked
function toggleStrikeThrough(checkbox, taskText) {
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
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task
function addFunction() {
    let newTask = document.getElementById('newNote').value;

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

    const buttonEdit = document.createElement("button");
    buttonEdit.className = "edit_btn";
    buttonEdit.onclick = function () {
        editFunction(buttonEdit);
    };

    const iconEdit = document.createElement("i");
    iconEdit.className = "bx bx-edit";
    buttonEdit.appendChild(iconEdit);

    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'del_btn';
    buttonDelete.onclick = function () {
        delFunction(buttonDelete);
    };

    const iconDel = document.createElement('i');
    iconDel.className = 'bx bx-trash';
    buttonDelete.appendChild(iconDel);

    // Append elements to task container
    taskContent.appendChild(taskCheck);
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskEdit);
    taskBox.appendChild(taskContent);
    btnBox.appendChild(buttonEdit);
    btnBox.appendChild(buttonDelete);
    taskBox.appendChild(btnBox);

    // Append task box to the main task list container
    document.querySelector('.node_box').appendChild(taskBox);

    // Dynamically adjust container height
    const noteBox = document.querySelector('.node_box');
    const currentHeight = parseInt(window.getComputedStyle(noteBox).height);
    const currentBox = document.querySelectorAll('.box_task');

    if (currentBox.length > 3) {
        noteBox.style.height = (currentHeight + 150) + 'px';
    }
}

// Function to handle task editing
function editFunction(button) {
    const taskContent = button.closest('.box_task');
    const noteText = taskContent.querySelector('.note_text');
    const editTask = taskContent.querySelector('.editTask');

    // Toggle between display modes for editing or saving
    if (editTask.style.display === "none" || editTask.style.display === "") {
        editTask.value = noteText.textContent;
        noteText.style.display = "none";
        editTask.style.display = "block";
        button.innerHTML = "<i class='bx bx-save'></i>";
    } else {
        noteText.textContent = editTask.value;
        noteText.style.display = "block";
        editTask.style.display = "none";
        button.innerHTML = "<i class='bx bx-edit'></i>";
        saveTasksToLocalStorage();
    }
}

// Function to handle task deletion
function delFunction(button) {
    const taskBox = button.closest('.box_task');
    taskBox.remove();

    // Adjust container height after deletion
    const noteBox = document.querySelector('.node_box');
    const currentHeight = parseInt(window.getComputedStyle(noteBox).height);
    const currentBox = document.querySelectorAll('.box_task');

    if (currentBox.length >= 3) {
        noteBox.style.height = (currentHeight - 150) + 'px';
    }

    saveTasksToLocalStorage();
    updateTaskCount();
}

// Function to update the task counter for incomplete tasks
function updateTaskCount() {
    const tasks = document.querySelectorAll('.box_task');
    const incompleteTasks = Array.from(tasks).filter(task => {
        const checkbox = task.querySelector('.readyTask');
        return checkbox && !checkbox.checked;  // Count only unchecked tasks
    });
    document.getElementById('numTask').textContent = incompleteTasks.length;  // Display incomplete tasks count
}
