const listContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const rightSideDisplayContainer = document.querySelector('[data-right-side-display-container');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');
const advice = document.querySelector('.advice');
const bodyContainer = document.querySelector('[data-body-container]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

selectedListId = null;
let adviceDiv = null;

listContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
});

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === '') return
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createTask(name) {
  return {
    id: Date.now().toString(), name: name, complete: false
  };
}

function createList(name) {
  return {
    id: Date.now().toString(), name: name, tasks: []
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}


function render() {
  clearElement(listContainer);
  renderLists();

  const selectedList = lists.find(list => list.id === selectedListId);
  if (selectedListId === null) {
    rightSideDisplayContainer.style.opacity = 0;
    addAnAdvice();
  } else {
    removeAnAdvice();
    rightSideDisplayContainer.style.display = '';
    rightSideDisplayContainer.style.opacity = 1;
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function addAnAdvice() {
  if (lists.length === 0 && rightSideDisplayContainer.style.opacity === '0') {
    rightSideDisplayContainer.style.display = 'none';
    adviceDiv = document.createElement('div');
    adviceDiv.classList.add('advice');
    const adviceDivTitle = document.createElement('h1');
    adviceDivTitle.innerText = 'Add and select your new list';
    bodyContainer.appendChild(adviceDiv);
    adviceDiv.appendChild(adviceDivTitle);
  }
}

function removeAnAdvice() {
  const adviceDiv = document.querySelector('.advice');
  if (adviceDiv) {
    adviceDiv.remove();
  }
}

function changeRightSideDivs() {
  console.log(rightSideDisplayContainer.style.opacity);
  if (rightSideDisplayContainer.style.opacity === 0) {
    rightSideDisplayContainer.classList.remove('right-side');
    rightSideDisplayContainer.classList.add('advice');
    advice.style.display = '';
  } else {
    advice.style.display = 'none';
  }

}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    const parag = taskElement.querySelector('p');
    label.htmlFor = task.id;
    parag.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks';
  listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaning`;
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listContainer.appendChild(listElement);

  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();