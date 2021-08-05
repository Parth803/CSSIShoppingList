console.log("Script running");

const unirest = require('unirest');

let googleUser;

firebase.auth().onAuthStateChanged(function(user) {
    googleUser = user;
}

let ingArr = [];
  
const notesRef = firebase.database().ref(`users/${userId}`);
notesRef.on('value', (snapshot) => {
    ingArr.push(snapshot.val());
});




const API_KEY = "da9eebbb65da478894ce3e45a23e7aa4";
let apiRequestURL = "?apiKey=" + API_KEY
const INGREDIENT_LIST = ingArr; //replace ingredients list with input
let baseString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/"; //base string for all request URLs

//
//
//
//
//find recipes from ingredients list:
// let recipeFinderString = baseString + "recipes/find" + "ByIngredients?number=5&ranking=1&ingredients=";
let recipeFinderString = baseString + "recipes/findByIngredients" + apiRequestURL + "&number=5&ranking=1&ingredients=";


const ingredientsString = INGREDIENT_LIST.map(ingredient =>
   ingredient + '%2C'
);

recipeFinderString = recipeFinderString + ingredientsString;

unirest.get(recipeFinderString)
.header("1d737f1d70534d378bdcbc673648ef6e",  API_KEY)
.end(function (result) {
   if (result.status === 200){
       getRecipeData(result.body);
   };
}); 

javascript .fetch(recipeFinderString) .then(response => response.json()) .then(myjson => { console.log(myjson); });