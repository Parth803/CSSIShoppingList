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

function updateList(){
  // 1. Capture the form data
  const ingredient = document.querySelector('#searchVal');
  // 2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser.uid}`).push({
    name: ingredient.value,
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    noteTitle.value = "";
    noteText.value = "";
  });
}