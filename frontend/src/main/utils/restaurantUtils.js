// get restaurants from local storage
const get = () => {
    const restaurantValue = localStorage.getItem("restaurants");
    if (restaurantValue === undefined) {
        const restaurantCollection = { nextId: 1, restaurants: [] }
        return set(restaurantCollection);
    }
    const restaurantCollection = JSON.parse(restaurantValue);
    if (restaurantCollection === null) {
        const restaurantCollection = { nextId: 1, restaurants: [] }
        return set(restaurantCollection);
    }
    return restaurantCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const restaurantCollection = get();
    const restaurants = restaurantCollection.restaurants;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = restaurants.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `restaurant with id ${id} not found` };
    }
    return { restaurant: restaurants[index] };
}

// set restaurants in local storage
const set = (restaurantCollection) => {
    localStorage.setItem("restaurants", JSON.stringify(restaurantCollection));
    return restaurantCollection;
};

// add a restaurant to local storage
const add = (restaurant) => {
    const restaurantCollection = get();
    restaurant = { ...restaurant, id: restaurantCollection.nextId };
    restaurantCollection.nextId++;
    restaurantCollection.restaurants.push(restaurant);
    set(restaurantCollection);
    return restaurant;
};

// update a restaurant in local storage
const update = (restaurant) => {
    const restaurantCollection = get();

    const restaurants = restaurantCollection.restaurants;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = restaurants.findIndex((r) => r.id == restaurant.id);
    if (index === -1) {
        return { "error": `restaurant with id ${restaurant.id} not found` };
    }
    restaurants[index] = restaurant;
    set(restaurantCollection);
    return { restaurantCollection: restaurantCollection };
};

// delete a restaurant from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const restaurantCollection = get();
    const restaurants = restaurantCollection.restaurants;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = restaurants.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `restaurant with id ${id} not found` };
    }
    restaurants.splice(index, 1);
    set(restaurantCollection);
    return { restaurantCollection: restaurantCollection };
};

const restaurantUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { restaurantUtils };



