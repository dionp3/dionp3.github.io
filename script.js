let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || [];

function renderTasks(listId, taskArray, isDoneItem = false) {
  const taskList = document.getElementById(listId);
  taskList.innerHTML = '';

  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

  const filteredTasks = taskArray.filter(task => task.name.toLowerCase().includes(searchQuery));

  filteredTasks.forEach((task, index) => {
    const taskItem = createTaskItem(task, index, isDoneItem);
    taskList.appendChild(taskItem);
  });
}

function createTaskItem(task, index, isDoneItem = false) {
  const taskItem = document.createElement('li');
  taskItem.className = `taskItem ${isDoneItem ? 'doneItem' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.className = 'doneCheckbox';
  checkbox.addEventListener('change', () => toggleTaskStatus(index, isDoneItem));

  const taskText = document.createElement('span');
  taskText.className = 'taskText';
  taskText.innerText = task.name;

  const dateText = document.createElement('span');
  dateText.className = 'dateText';
  dateText.innerText = task.date;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'deleteButton';
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => deleteTask(index, isDoneItem));

  taskItem.append(checkbox, taskText, dateText, deleteButton);

  return taskItem;
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  const taskName = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (taskName !== '') {
    const id = +new Date();

    const newTask = {
      id,
      name: taskName,
      date: taskDate,
      completed: false
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks('taskList', tasks);
    taskInput.value = '';
    dateInput.value = '';
  }
}

function toggleTaskStatus(index, fromDoneSection) {
  const sourceArray = fromDoneSection ? tasksDone : tasks;
  const targetArray = fromDoneSection ? tasks : tasksDone;

  const task = sourceArray[index];
  task.completed = !task.completed;

  targetArray.push(task);
  sourceArray.splice(index, 1);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('tasksDone', JSON.stringify(tasksDone));

  renderTasks('taskList', tasks);
  renderTasks('taskDoneList', tasksDone, true);
}

function deleteTask(index, fromDoneSection) {
  const taskArray = fromDoneSection ? tasksDone : tasks;
  taskArray.splice(index, 1);

  const storageKey = fromDoneSection ? 'tasksDone' : 'tasks';
  localStorage.setItem(storageKey, JSON.stringify(taskArray));

  renderTasks(fromDoneSection ? 'taskDoneList' : 'taskList', taskArray, fromDoneSection);
}

function handleSearchInput() {
  renderTasks('taskList', tasks);
  renderTasks('taskDoneList', tasksDone, true);
}

document.getElementById('addButton').addEventListener('click', addTask);
document.getElementById('searchInput').addEventListener('input', handleSearchInput);

renderTasks('taskList', tasks);
renderTasks('taskDoneList', tasksDone, true);
