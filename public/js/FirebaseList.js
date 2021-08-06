let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user.uid;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};


function updateList(img, item){
  const imgUrl = 'https://spoonacular.com/cdn/ingredients_500x500/'+img;
  let dataArr = [];    
  const notesRef = firebase.database().ref(`users/${googleUser}`);
  notesRef.once('value', (snapshot) => {
      let data = snapshot.val();
      for (key in data) {
        let child = data[key];
        if(child.name==item){
            child.quantity += 1;
            const childRef = firebase.database().ref(`users/${googleUser}/${key}`);
            childRef.update(child);
            return;
        }
       }
       notesRef.push({
            name: item,
            image: imgUrl,
            quantity: 1,
        });
  });
}

function deleteNote(noteId) {
    firebase.database().ref(`users/${googleUser}/${noteId}`).remove();
    console.log("deleted ", noteId);
}