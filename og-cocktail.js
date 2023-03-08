function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

async function safe_get(url) {
  try {
    const response = await urllib.request(url);
    return response.data;
  } catch (e) {
    console.error(`Error requesting url ${url}: ${e.message}`);
    return null;
  }
}

async function search_by_ings(ingredients) {
  let new_url = 'https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=';
  for (const ing of ingredients) {
    const ing_safe = ing.trim().replace(/ /g, '_').toTitleCase();
    new_url += `${ing_safe},`;
    const result_json = await safe_get(new_url.slice(0, -1));
  }
  console.log(new_url.slice(0, -1));
  return result_json;
}

async function get_drink_info(id) {
  const new_url = `https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=${id}`;
  const result_json = await safe_get(new_url);
  return result_json;
}

async function search(ing_list) {
  const search_results = await search_by_ings(ing_list);
  const drink_list = {};
  if (search_results.drinks !== null) {
    for (const drink of search_results.drinks) {
      drink_list[drink.strDrink] = await get_drink_info(drink.idDrink);
    }
  }
  return drink_list;
}

function filter(drinks, type) {
  const new_drinks = {};
  for (const drink in drinks) {
    if (type) {
      if (drinks[drink].drinks[0].strAlcoholic === type) {
        new_drinks[drink] = drinks[drink].drinks[0];
      } else if (drinks[drink].drinks[0].strGlass === type) {
        new_drinks[drink] = drinks[drink].drinks[0];
      }
    } else {
      new_drinks[drink] = drinks[drink].drinks[0];
    }
  }
  return new_drinks;
}

function filter_glass(drinks, glass) {
  const new_drinks = {};
  for (const drink in drinks) {
    if (drinks[drink].strGlass === type) {
      new_drinks[drink] = drinks[drink];
    }
  }
  return new_drinks;
}

function drink_formatter(drink_dict) {
  const ref = drink_dict.drinks[0];
  const new_dict = { ingredients: {} };
  for (const [key, value] of Object.entries(ref)) {
    if (key.startsWith('strIngredient') && value !== null) {
      const measure = `strMeasure${key.slice(13)}`;
      new_dict.ingredients[value] = ref[measure];
    }
  }
  new_dict.steps = ref.strInstructions.split('. ');
  new_dict.img = ref.strDrinkThumb;
  new_dict.alcoholic = ref.strAlcoholic;
  new_dict.glass = ref.strGlass.toTitleCase();
  new_dict.name = ref.strDrink;
  console.log(pretty(new_dict));
  return new_dict;
}

app.get('/', (req, res) => {
  res.render('drinkform.html');
});
