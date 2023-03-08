import {
  html,
  render
} from "lit-html";

let searchButton = document.getElementById("search")
searchButton.addEventListener("click", doSearch)


function doSearch() {
  console.log("searching!")
  let searchStr = document.getElementById("text-input").value;
  console.log(searchStr)

  let baseURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="
  let newURL = baseURL.concat(searchStr)
  console.log(newURL)

  // Fetch data from jsonplaceholder's "users" endpoint
  fetch(newURL)
    // Then convert the response to JSON
    .then((response) => response.json())

    // Then do something with the JSON data
    .then((data) => {
      let drinks = data;
      console.log(drinks)

      // Use .map to create an array of html templates to render to the DOM
      let drinkList = drinks.drinks.map(function(drink) {
        return html`<div class="user-entry">
      <h2>${drink.strDrink}</h2>
    </div>`;
      });

      // Render the userList array to the user-list div
      render(drinkList, document.getElementById("user-list"));
    });
}