import { http } from './http';
let current_page=1;

function SetupPagination (data, uielement, rows) {
  uielement.innerHTML = "";

  let page_count = Math.ceil(data.length / rows);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationButton(i, data);
    uielement.appendChild(btn);
  }
  return data;
}

function DisplayList (datas, wrapper, rows, page) {
  wrapper.innerHTML = "";
  page--;
 
  let start = rows * page;
  let end = start + rows;
  let paginatedItems = datas.slice(start, end);
  
  let output = '';
  let post = document.querySelector('#posts');

  paginatedItems.every(function(data, index) {
    
    output += `
      <div class="card mb-3">
        <div class="card-body">
          <h4 class="card-title">${data.title}</h4>
          <p class="card-text">${data.body}</p>
          <a href="#" class="edit card-link" data-id="${data.id}">
            <i class="fa fa-pencil"></i>
          </a>

          <a href="#" class="delete card-link" data-id="${data.id}">
          <i class="fa fa-remove"></i>
        </a>
        </div>
      </div>
    `;

    if (paginatedItems.length===index) return false
    else return true
  });
  post.innerHTML = output;
  return paginatedItems;
}

function PaginationButton (page, datas) {
  let button = document.createElement('button');
  button.innerText = page;
  if (current_page == page) button.classList.add('active');

  button.addEventListener('click', function () {
    current_page = page;
    
    DisplayList(datas,ui.post,ui.rows,current_page);
    let current_btn = document.querySelector('.pagenumbers button.active');
    current_btn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}


class UI {
  constructor() {
    this.post = document.querySelector('#posts');
    this.titleInput = document.querySelector('#title');
    this.bodyInput = document.querySelector('#body');
    this.idInput = document.querySelector('#id');
    this.postSubmit = document.querySelector('.post-submit');
    this.forState = 'add';
    this.pagi= document.querySelector('#pagination');
    this.current_page = 1;
    this.rows = 10;
  }

  // Show all posts
  showPosts(posts) {
    let output = '';

    posts.forEach((post) => {
      output += `
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="card-title">${post.title}</h4>
            <p class="card-text">${post.body}</p>
            <a href="#" class="edit card-link" data-id="${post.id}">
              <i class="fa fa-pencil"></i>
            </a>

            <a href="#" class="delete card-link" data-id="${post.id}">
            <i class="fa fa-remove"></i>
          </a>
          </div>
        </div>
      `;
    });

    this.post.innerHTML = output;
  }

  // Show alert message
  showAlert(message, className) {
    this.clearAlert();

    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = className;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.postsContainer');
    // Get posts
    const posts = document.querySelector('#posts');
    // Insert alert div
    container.insertBefore(div, posts);

    // Timeout
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  // Clear alert message
  clearAlert() {
    const currentAlert = document.querySelector('.alert');

    if(currentAlert) {
      currentAlert.remove();
    }
  }

  // Clear all fields
  clearFields() {
    this.titleInput.value = '';
    this.bodyInput.value = '';
  }

  // Fill form to edit
  fillForm(data) {
    this.titleInput.value = data.title;
    this.bodyInput.value = data.body;
    this.idInput.value = data.id;

    this.changeFormState('edit');
  }

  // Clear ID hidden value
  clearIdInput() {
    this.idInput.value = '';
  }

  // Change the form state
  changeFormState(type) {
    if(type === 'edit') {
      this.postSubmit.textContent = 'Update Post';
      this.postSubmit.className = 'post-submit btn btn-warning btn-block';

      // Create cancel button
      const button = document.createElement('button');
      button.className = 'post-cancel btn btn-light btn-block';
      button.appendChild(document.createTextNode('Cancel Edit'));

      // Get parent
      const cardForm = document.querySelector('.card-form');
      // Get element to insert before
      const formEnd = document.querySelector('.form-end');
      // Insert cancel button
      cardForm.insertBefore(button, formEnd);
    } else {
      this.postSubmit.textContent = 'Post It';
      this.postSubmit.className = 'post-submit btn btn-primary btn-block';
      // Remove cancel btn if it is there
      if(document.querySelector('.post-cancel')) {
        document.querySelector('.post-cancel').remove();
      }
      // Clear ID from hidden field
      this.clearIdInput();
      // Clear text
      this.clearFields();
    }
  }

  toGenerate()
{
  http.get('http://localhost:3000/posts')
  .then(data => SetupPagination(data,ui.pagi,ui.rows,ui.current_page))
  .then(data => DisplayList(data,ui.post,ui.rows,ui.current_page))
  .catch(err => console.log(err));
}
  

}


export const ui = new UI();