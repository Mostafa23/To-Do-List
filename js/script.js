// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const notification = document.getElementById('notification');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add new task
addTaskBtn.addEventListener('click', addTask);

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return; // Don't add if input is empty

  const taskObj = {
    id: getNextId(), // ID
    text: taskText,
    completed: false // Default state for task
  };

  const li = createTaskElement(taskObj); // Create HTML element for task
  taskList.appendChild(li);

  saveTask(taskObj); // Save task to localStorage
  showNotification('Task added successfully!');
  taskInput.value = ''; // Clear input field
}

// Create task element
function createTaskElement(taskObj) {
  const li = document.createElement('li');
  li.setAttribute('data-id', taskObj.id); // Set ID for task
  li.style.textAlign = 'center';
  
  // Create task text element
  const taskText = document.createElement('span');
  taskText.textContent = taskObj.text;
  taskText.className = 'task-text';
  taskText.addEventListener('click', () => markComplete(taskObj)); // Mark task as complete on click

  if (taskObj.completed) {
    li.classList.add('completed'); // Add class if task is completed
  }

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete';
  deleteBtn.onclick = deleteTask;

  // Create edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit';
  editBtn.onclick = editTask;

  li.appendChild(taskText);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

// Mark task as completed or not
function markComplete(taskObj) {
  const li = document.querySelector(`[data-id='${taskObj.id}']`);
  li.classList.toggle('completed');
  taskObj.completed = !taskObj.completed; // Toggle completion state
  updateTaskInStorage(taskObj); // Update task in localStorage
  if(taskObj.completed){
    showNotification('Complete Task')
  }
}

// Delete a task
function deleteTask(e) {
  const task = e.target.parentElement;
  task.style.animation = 'remove-task 0.5s ease forwards'; // Apply animation
  setTimeout(() => {
    const taskId = task.getAttribute('data-id'); // Get task ID
    task.remove();
    deleteTaskFromStorage(taskId); // Remove task from localStorage
    showNotification('Task deleted successfully!');
  }, 500); // Delay removal to match animation
}

// Edit a task
function editTask(e) {
  const task = e.target.parentElement;
  taskInput.value = task.querySelector('.task-text').textContent;
  const taskId = task.getAttribute('data-id');
  task.remove();
  deleteTaskFromStorage(taskId);
}

// Get the next unique ID
function getNextId() {
  let nextId = localStorage.getItem('nextId');
  if (!nextId) {
    nextId = 1; // Start with 1 if no ID is stored
  } else {
    nextId = Number(nextId);
  }
  localStorage.setItem('nextId', nextId + 1); // Increment stored ID
  return nextId;
}

// Save task to localStorage
function saveTask(taskObj) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(taskObj);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(taskObj => {
    const li = createTaskElement(taskObj);
    taskList.appendChild(li);
  });

  // Update nextId based on highest existing ID
  const highestId = tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0);
  localStorage.setItem('nextId', highestId + 1);
}

// Delete task from localStorage using its ID
function deleteTaskFromStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(taskObj => taskObj.id !== Number(taskId)); // Remove task by ID
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task in localStorage
function updateTaskInStorage(updatedTaskObj) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.map(taskObj =>
    taskObj.id === updatedTaskObj.id ? updatedTaskObj : taskObj
  );
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show notification
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000); // Hide notification after 2 seconds
}
