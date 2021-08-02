let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

const getItems = (userId) => {
  let dataArr = [];    
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
      dataArr.push(snapshot.val());
  });
  return dataArr;
};

function updateList(){
  // 1. Capture the form data
  const ingredient = document.querySelector('#searchVal');
  const quantity = checkQuant(ingredient);
  // 2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser.uid}`).push({
    name: ingredient.value,
    quantity: quantity,
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    ingredient.value = "";
  });
}

function checkQuant(name){
    let quantity = 0;
    const data = getItems(googleUser);
    for(item in data){
        if(item==name){
            quantity++;
            deleteNote(item);            
        }
    }
    return quantity;
}

function deleteNote(noteId) {
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
    console.log("deleted ", noteId);
}