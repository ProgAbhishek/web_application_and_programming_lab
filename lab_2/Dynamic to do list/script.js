const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filterSelect = document.getElementById("status-filter");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.getElementById("empty-state");

const STORAGE_KEY = "dynamicTodoItems";

let todos = loadTodos();
let filter = "all";

render();

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const text = input.value.trim();
	if (!text) {
		return;
	}

	const newTodo = {
		id: Date.now(),
		text,
		completed: false
	};

	todos.unshift(newTodo);
	saveTodos();
	render();

	form.reset();
	input.focus();
});

filterSelect.addEventListener("change", (event) => {
	filter = event.target.value;
	render();
});

list.addEventListener("click", (event) => {
	const target = event.target;
	const itemElement = target.closest(".todo-item");

	if (!itemElement) {
		return;
	}

	const id = Number(itemElement.dataset.id);

	if (target.classList.contains("toggle-checkbox")) {
		const todo = todos.find((entry) => entry.id === id);
		if (!todo) {
			return;
		}

		todo.completed = target.checked;
		saveTodos();
		render();
		return;
	}

	if (target.classList.contains("delete-btn")) {
		todos = todos.filter((entry) => entry.id !== id);
		saveTodos();
		render();
	}
});

clearCompletedBtn.addEventListener("click", () => {
	todos = todos.filter((entry) => !entry.completed);
	saveTodos();
	render();
});

function render() {
	const visibleTodos = getVisibleTodos();
	list.innerHTML = "";

	visibleTodos.forEach((todo) => {
		const item = document.createElement("li");
		item.className = `todo-item${todo.completed ? " completed" : ""}`;
		item.dataset.id = String(todo.id);

		item.innerHTML = `
			<input class="toggle-checkbox" type="checkbox" ${todo.completed ? "checked" : ""} aria-label="Mark task as complete">
			<span class="todo-text"></span>
			<button class="delete-btn" type="button" aria-label="Delete task">Delete</button>
		`;

		const textNode = item.querySelector(".todo-text");
		textNode.textContent = todo.text;

		list.appendChild(item);
	});

	emptyState.style.display = visibleTodos.length === 0 ? "block" : "none";
}

function getVisibleTodos() {
	if (filter === "active") {
		return todos.filter((todo) => !todo.completed);
	}

	if (filter === "completed") {
		return todos.filter((todo) => todo.completed);
	}

	return todos;
}

function loadTodos() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return [];
		}

		const parsed = JSON.parse(stored);
		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed.filter(
			(item) =>
				item &&
				typeof item.id === "number" &&
				typeof item.text === "string" &&
				typeof item.completed === "boolean"
		);
	} catch {
		return [];
	}
}

function saveTodos() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
