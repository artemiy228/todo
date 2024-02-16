const taskForm = document.querySelector(".task-form"),
  taskList = document.querySelector("#task-list"),
  taskInput = document.querySelector("#new-task");

let tasks = [];
checkEmptyList(taskList);

if (localStorage.getItem("tasks"))
  tasks = JSON.parse(localStorage.getItem("tasks"));

tasks.forEach((task) => renderTask(task)); // render localStorage

taskForm.addEventListener("submit", addTask);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", doneTask);

// function
function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;

  let newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  if (taskText.length < 1 || taskText.length > 20) return alert("dolben`");

  tasks.push(newTask);
  saveToLocalStorage();
  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();
  checkEmptyList(taskList);
}
function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.parentNode.parentNode;

  // Определяем ID задачи
  const id = Number(parentNode.id);
  // const index = tasks.findIndex((task) => task.id === id);
  // tasks.splice(index, 1);
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();

  parentNode.remove();
  checkEmptyList(taskList);
}
function doneTask(event) {
  event.preventDefault();
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.parentNode.parentNode;
  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("done");
  // event.target.classList.toggle("btn-success");
}
function checkEmptyList(taskList) {
  if (!tasks.length) {
    const emptyListElement = `
    <div class="empty-task m-3">
      <h4>
        <b>Список задач на сегодня пуст!</b>
      </h4>
    </div>`;
    return taskList.insertAdjacentHTML("afterbegin", emptyListElement);
  }
  if (tasks.length > 0) {
    const emptyList = document.querySelector(".empty-task");
    emptyList ? emptyList.remove() : null;
  }
}
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTask(task) {
  const cssClass = task.done ? "task-title done" : "task-title";
  const taskHTML = `
  <li id="${task.id}" class="d-flex justify-content-between p-3 bg-info" style="height: 70px; align-items:center">
    <b class="${cssClass}"> ${task.text} </b>
    <p>
      <button data-action="done" class=" btn btn-primary" style="cursor: pointer">done</button>
      <button data-action="delete" class="btn btn-primary" style="cursor: pointer">&times;</button>
    </p>
  </li>
  `;
  taskList.insertAdjacentHTML("beforeend", taskHTML);
}
