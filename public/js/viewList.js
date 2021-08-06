let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  for(const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem);
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
   return `
     <div class="column is-one-quarter">
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">${note.name}</p>
         </header>
         <div class="card-content">
           <div class="content">
           <img src='${note.image}'width='500'>
           </div>
         </div>
         <div class="card-content">
           <div class="content">
           Quantity: ${note.quantity}
           <button id='addQuantity' class = 'button is-link is-small' onclick = 'quantPlus("`+noteId+`","`+note.name+`")'>Add</button>
           <button id='addQuantity' class = 'button is-link is-small' onclick = 'quantMinus("`+noteId+`","`+note.name+`")'>Remove</button>
           </div>
         </div>
         <div class="card-content">
           <div class="content">
           <button id='addQuantity' class = 'button is-link is-small' onclick = 'listDelete("`+noteId+`","`+note.name+`")'>Delete</button>
           </div>
         </div>
       </div>
     </div>
   `;
};

/*
function editNote(noteId){
    const editNoteModal=document.querySelector('#editNoteModal');


    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const noteDetails = data[noteId];
        document.querySelector('#editTitleInput').value = noteDetails.title;
        document.querySelector('#editTextInput').value = noteDetails.text;
        document.querySelector('#noteId').value = noteId;
    })

    editNoteModal.classList.toggle('is-active');
}

function saveEditedNote(){
    const title = document.querySelector('#editTitleInput').value;
    const text = document.querySelector('#editTextInput').value;
    const noteId = document.querySelector('#noteId').value;
    const editedNote = { title, text };
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(editedNote);
    editNoteModal.classList.toggle('is-active');
}

function closeEditModal(){
    const editNoteModal = document.querySelector('#editNoteModal');
    editNoteModal.classList.toggle('is-active');
}

function deleteNote(noteId) {
    if(window.confirm("Are you sure you want to delete this note?")){
        firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
        console.log("deleted ", noteId);
    }
}
*/


function quantPlus(noteId, name){

    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.once('value', (snapshot) => {
      let data = snapshot.val();
      for (key in data) {
        let child = data[key];
        if(child.name==name){
            child.quantity += 1;
            const childRef = firebase.database().ref(`users/${googleUserId}/${key}`);
            childRef.update(child);
            return;
        }
       }
  });
  
}

function quantMinus(noteId, name){

    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.once('value', (snapshot) => {
      let data = snapshot.val();
      for (key in data) {
        let child = data[key];
        if(child.name==name){
            if(child.quantity>1){
                child.quantity -= 1;
                const childRef = firebase.database().ref(`users/${googleUserId}/${key}`);
                childRef.update(child);
                return;
            }else{
                firebase.database().ref(`users/${googleUserId}/${key}`).remove();
            }
        }
       }
  });
  
}

function listDelete(noteId, name) {
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.once('value', (snapshot) => {
      let data = snapshot.val();
      for (key in data) {
        let child = data[key];
        if(child.name==name){
            firebase.database().ref(`users/${googleUserId}/${key}`).remove();
       }
      }
  });
}