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

/*
function getItems(userId) {
  let dataArr = [];    
  const notesRef = firebase.database().ref(`users/${userId}`).orderByChild("title");
  notesRef.on('value', (snapshot) => {
      console.log('get Items');
    snapshot.forEach((child) => {
        console.log(child.val().name);
        dataArr.push(child.val());
    });
    console.log('data array');
    console.log(dataArr);
    return dataArr;
  });
};
*/

function updateList(item){
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
            quantity: 1,
        });
       /*
      const item = snapshot.val().find(el => el.name === item);
      if(item){
          item.quantity += 1;
          notesRef.setValue(snapshot);
      }else{
          notesRef.push({
              name: item,
              quantity: 1,
          })
      }
      */
  });
  /*
  // 1. Capture the form data
  let quant = 1;
  quant = updateItems(item);
  // 2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser}`).push({
    name: item,
    quantity: quant,
  })
  */
}


/*
function updateItems(userId, item)  
1. get item from db at /userid/item
2. if no item, save 1 as the value
if there is an item, save n+1
*/

/*
function getItems(userId) {
  let quantity = 1;
  let dataArr = [];
  const notesRef =
      firebase.database().ref(`users / ${userId}`).orderByChild("title");
      notesRef.on('value', (snapshot) => {
        console.log('get Items');
        snapshot.forEach((child) => {
          console.log(child.val().name);
          dataArr.push(child.val());
        });
        for (var i = 0; i < dataArr.length; i++) {
          let child = dataArr[i];
          console.log("child name");
        if (item == child.name) {
            quantity += child.quantity;
            deleteNote(child);
          }
        }
        console.log("Final quantity");
        console.log(quantity);
      });
      
};
*/

/*
function checkQuant(item){
    let quantity = 1;
    for (var i = 0; i < getItems(googleUser).length; i++) {
        let child = data[i];
        console.log("child name");
        console.log(child.name);
        if(item==child.name){
            quantity += child.quantity;
            deleteNote(child);
        }
    }
    return quantity;
}
*/

function deleteNote(noteId) {
    firebase.database().ref(`users/${googleUser}/${noteId}`).remove();
    console.log("deleted ", noteId);
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