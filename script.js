let numbering = document.getElementById('numTask');

// Toggles the strike-through style for tasks when checkbox is clicked
function toggleStrikeThrough(checkbox, taskText) {
    // If checkbox is checked, add strike-through class; otherwise, remove it
    if (checkbox.checked) {
        taskText.classList.add('strike-through');
    } else {
        taskText.classList.remove('strike-through');
    }
    saveTasksToLocalStorage(); // Save tasks to local storage after toggle
    updateTaskCount(); // Update task count after toggling
}

// Load saved tasks from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks or initialize to empty array
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed); // Add each task to the DOM
    });
    updateTaskCount(); // Update task count after loading tasks
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.box_task').forEach(taskBox => {
        const text = taskBox.querySelector('.note_text').textContent; // Get task text
        const completed = taskBox.querySelector('.readyTask').checked; // Get task completion status
        tasks.push({ text, completed }); // Push task object to tasks array
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks array to local storage
}

// Function to add a new task
function addFunction() {
    let newTask = document.getElementById('newNote').value; // Get value from input

    // Alert if the input is empty
    if (newTask.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    addTaskToDOM(newTask, false); // Add new task to DOM as incomplete
    saveTasksToLocalStorage(); // Save tasks to local storage

    document.getElementById('newNote').value = ''; // Clear input field
    updateTaskCount(); // Update task count after adding new task
}

// Function to add a task element to the DOM
function addTaskToDOM(taskTextValue, isCompleted) {
    const taskBox = document.createElement('div'); // Create task box
    taskBox.className = 'box_task'; // Assign class name to task box

    const taskContent = document.createElement('div'); // Create task content container
    taskContent.className = 'task_content'; // Assign class name to task content

    const taskCheck = document.createElement('input'); // Create checkbox
    taskCheck.className = 'readyTask'; // Assign class name to checkbox
    taskCheck.type = 'checkbox'; // Set type to checkbox
    taskCheck.checked = isCompleted; // Set checkbox checked state based on task completion

    // Create a paragraph element for task text
    const taskText = document.createElement('p');
    taskText.className = 'note_text'; // Assign class name to task text
    taskText.textContent = taskTextValue; // Set task text content

    // If task is completed, apply the strike-through style
    if (isCompleted) {
        taskText.classList.add('strike-through'); // Add strike-through style for completed tasks
    }

    // Event listener for checkbox to toggle strike-through
    taskCheck.addEventListener('change', function () {
        toggleStrikeThrough(taskCheck, taskText); // Call toggle function on checkbox change
    });

    const taskEdit = document.createElement('textarea'); // Create textarea for editing task
    taskEdit.className = 'editTask'; // Assign class name to textarea
    taskEdit.style.display = 'none'; // Hide textarea by default

    const btnBox = document.createElement('div'); // Create button box for edit and delete buttons
    btnBox.className = 'btn_box'; // Assign class name to button box

    // Create edit button
    const buttonEdit = document.createElement("button");
    buttonEdit.className = "edit_btn"; // Assign class name to edit button
    buttonEdit.onclick = function () {
        editFunction(buttonEdit); // Call edit function on button click
    };

    const iconEdit = document.createElement("i"); // Create edit icon
    iconEdit.className = "bx bx-edit"; // Assign class name to edit icon
    buttonEdit.appendChild(iconEdit); // Append icon to edit button

    // Create delete button
    const buttonDel = document.createElement("button");
    buttonDel.className = "del_btn"; // Assign class name to delete button
    buttonDel.onclick = function () {
        taskBox.remove(); // Remove task box from DOM
        saveTasksToLocalStorage(); // Save tasks to local storage
        updateTaskCount(); // Update task count after deletion
    };

    const iconDel = document.createElement("i"); // Create delete icon
    iconDel.className = "bx bx-trash"; // Assign class name to delete icon
    buttonDel.appendChild(iconDel); // Append icon to delete button

    // Append all elements together
    taskContent.appendChild(taskCheck); // Append checkbox to task content
    taskContent.appendChild(taskText); // Append task text to task content
    btnBox.appendChild(buttonEdit); // Append edit button to button box
    btnBox.appendChild(buttonDel); // Append delete button to button box
    taskBox.appendChild(taskContent); // Append task content to task box
    taskBox.appendChild(taskEdit); // Append textarea to task box
    taskBox.appendChild(btnBox); // Append button box to task box

    // Add new tasks at the bottom of the task list
    const taskList = document.querySelector('.task_list');
    taskList.appendChild(taskBox); // Append task box to task list
}

// Edit function for tasks
function editFunction(buttonEdit) {
    const taskBox = buttonEdit.closest('.box_task'); // Get closest task box
    const taskText = taskBox.querySelector('.note_text'); // Get task text
    const taskEdit = taskBox.querySelector('.editTask'); // Get textarea for editing

    // Toggle edit mode
    if (taskEdit.style.display === 'none') {
        taskEdit.value = taskText.textContent; // Set textarea value to task text
        taskEdit.style.display = 'block'; // Show textarea
        taskText.style.display = 'none'; // Hide task text
        buttonEdit.innerHTML = '<i class="bx bx-check"></i>'; // Change edit button to check icon
    } else {
        taskText.textContent = taskEdit.value; // Update task text with edited value
        taskEdit.style.display = 'none'; // Hide textarea
        taskText.style.display = 'block'; // Show task text
        buttonEdit.innerHTML = '<i class="bx bx-edit"></i>'; // Change check button back to edit icon
        saveTasksToLocalStorage(); // Save tasks to local storage after editing
    }
}

// Update task count
function updateTaskCount() {
    const totalTasks = document.querySelectorAll('.box_task').length; // Get total number of tasks
    const completedTasks = document.querySelectorAll('.box_task .readyTask:checked').length; // Get number of completed tasks

    // Calculate active tasks
    const activeTasks = totalTasks - completedTasks; // Active tasks are total tasks minus completed tasks

    // Update display of active tasks count
    numbering.textContent = activeTasks;
}
