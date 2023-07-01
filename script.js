//javascript is hardd, but i know i must do it, nothing is easy in this world

const BASE_URL = 'https://notes-api.dicoding.dev/v1';
let accessToken = '';

function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

function registerUser(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert('User created successfully');
    } else {
      alert('Error creating user');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred, sowry');
  });
}

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      accessToken = data.data.accessToken;
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('notesForm').style.display = 'block';
      document.getElementById('notesList').style.display = 'block';
      getNotes();
      createWelcomeNote();
    } else {
      alert('Invalid credentials');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred, sowry');
  });
}

function createNote(event) {
  event.preventDefault();
  
  const title = document.getElementById('noteTitle').value;
  const body = document.getElementById('noteBody').value;
  
  fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      title: title,
      body: body
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert('Note created successfully');
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteBody').value = '';
      getNotes();
    } else {
      alert('Error creating note sowry');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred, sowry');
  });
}

function createNoteElement(note) {
  const li = document.createElement('li');
  li.classList.add('note');

  const titleElem = document.createElement('strong');
  titleElem.innerText = note.title;
  li.appendChild(titleElem);

  const bodyElem = document.createElement('p');
  bodyElem.innerText = note.body;
  li.appendChild(bodyElem);

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  deleteBtn.addEventListener('click', () => deleteNote(note.id));

  li.appendChild(deleteBtn);
  return li;
}

function getNotes() {
  fetch(`${BASE_URL}/notes`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const notes = data.data;
      const noteItems = document.getElementById('noteItems');
      noteItems.innerHTML = '';

      notes.forEach(note => {
        const li = createNoteElement(note);
        noteItems.appendChild(li);
      });
    } else {
      alert('Error retrieving notes, sowry');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred, sowry');
  });
}

function createWelcomeNote() {
  fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const user = data.data;
      const title = `Welcome to Notes, ${user.name}!`;
      const body = 'This is your note. You now can create notes and delete it. Have fun!';

      fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          title: title,
          body: body
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          console.log('Welcome note created successfully');
        } else {
          console.log('Error creating welcome note');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred, sowry');
      });
    } else {
      console.log('Error retrieving user data');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred, sowry');
  });
}

function deleteNote(noteId) {
  fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert('Note deleted successfully');
      getNotes();
    } else {
      alert('Error deleting note, sowry');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred, sowry');
  });
}
