// get dogs from local storage
const get = () => {
    const dogValue = localStorage.getItem("dogs");
    if (dogValue === undefined) {
        const dogCollection = { nextId: 1, dogs: [] }
        return set(dogCollection);
    }
    const dogCollection = JSON.parse(dogValue);
    if (dogCollection === null) {
        const dogCollection = { nextId: 1, dogs: [] }
        return set(dogCollection);
    }
    return dogCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const dogCollection = get();
    const dogs = dogCollection.dogs;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = dogs.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `dog with id ${id} not found` };
    }
    return { dog: dogs[index] };
}

// set dogs in local storage
const set = (dogCollection) => {
    localStorage.setItem("dogs", JSON.stringify(dogCollection));
    return dogCollection;
};

// add a dog to local storage
const add = (dog) => {
    const dogCollection = get();
    dog = { ...dog, id: dogCollection.nextId };
    dogCollection.nextId++;
    dogCollection.dogs.push(dog);
    set(dogCollection);
    return dog;
};

// update a dog in local storage
const update = (dog) => {
    const dogCollection = get();

    const dogs = dogCollection.dogs;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = dogs.findIndex((r) => r.id == dog.id);
    if (index === -1) {
        return { "error": `dog with id ${dog.id} not found` };
    }
    dogs[index] = dog;
    set(dogCollection);
    return { dogCollection: dogCollection };
};

// delete a dog from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const dogCollection = get();
    const dogs = dogCollection.dogs;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = dogs.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `dog with id ${id} not found` };
    }
    dogs.splice(index, 1);
    set(dogCollection);
    return { dogCollection: dogCollection };
};

const dogUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { dogUtils };



