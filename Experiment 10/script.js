const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let todos = [];

addBtn.addEventListener('click', () => {
  const task = todoInput.value.trim();
  if (task === '') return alert('Please enter a task!');
  
  todos.push(task);
  todoInput.value = '';
  renderTodos();
});

function renderTodos() {
  todoList.innerHTML = '';
  
  todos.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task;

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteTask(index);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

function editTask(index) {
  const newTask = prompt('Edit your task:', todos[index]);
  if (newTask !== null && newTask.trim() !== '') {
    todos[index] = newTask.trim();
    renderTodos();
  }
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    todos.splice(index, 1);
    renderTodos();
  }
}
