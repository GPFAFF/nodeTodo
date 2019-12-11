const formatTodo = (element) => {
  return `
    <li>
      <span>${element.text}</span>
      <button data-id=${element._id} class='edit'>Edit</button>
      <button data-id=${element._id} class='delete'>Delete</button>
    </li>
  `
}

const createTodo = (event) => {
  event.preventDefault();
  const input = document.getElementById('todo');
  const list = document.getElementById('todoList');

  if (event.type === 'click' && !event.target.classList.contains('addTodo')) return;

  if (input === '') return;
  
    axios
      .post('/create-item', {text: input.value})
      .then((response) => {
        list.insertAdjacentHTML('beforeend', formatTodo(response.data));
        input.value = '';
        input.focus();
      })
      .catch(err => console.warn('Something went wrong', err.message))
}

const editTodo = (event) => {
  if (!event.target.classList.contains('edit')) return;

  const sibling = event.target.previousElementSibling;
  const userInput = prompt('Edit Todo', sibling.innerText);
  if (userInput) {
    axios.post('/update-item', {text: userInput, id: event.target.getAttribute('data-id')
    })
    .then(() =>  sibling.innerText = userInput)
    .catch(err => console.warn('Something went wrong', err.message));
  }
}

const deleteTodo = (event) => {
  if (!event.target.classList.contains('delete')) return;
  
  const todoItem = event.target.previousElementSibling.parentNode;

  if (confirm('Are you sure?')) {
    axios
      .post('/delete-item', {id: event.target.getAttribute('data-id')})
      .then(() => todoItem.remove())
      .catch(err => console.warn('Something went wrong', err.message));
  }
}

document.addEventListener('submit', (event) => createTodo(event));

document.addEventListener('click', (event) => {
  editTodo(event)
  deleteTodo(event)
  createTodo(event);
});
