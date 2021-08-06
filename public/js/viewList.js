let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      const googleUserId = user.uid;
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
    cards += createCard(note)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note) => {
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
           <div class="content">Quantity: ${note.quantity}</div>
         </div>
       </div>
     </div>
   `;
};

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

function quantPlus(noteId){
    let qty = firebase.database().ref(`users/${googleUserId}/${noteId}/quantity`).val();
    firebase.database().ref(`users/${googleUserId}/${noteId}`).push({
        quantity: qty+1,
    });
}

function listDelete(noteId, qty) {
    if(qty>1){
        qty--;
        //set document.querySelector here
        firebase.database().ref(`users/${googleUser}/${noteId}`).push({
            quantity: qty,
        })
    }else{
    firebase.database().ref(`users/${googleUser}/${noteId}`).remove();
    console.log("deleted ", noteId);
    }
}