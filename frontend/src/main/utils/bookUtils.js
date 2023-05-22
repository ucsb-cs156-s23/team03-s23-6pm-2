// get books from local storage
const get = () => {
    const bookValue = localStorage.getItem("books");
    if (bookValue === undefined) {
        const bookCollection = { nextId: 1, books: [] }
        return set(bookCollection);
    }
    const bookCollection = JSON.parse(bookValue);
    if (bookCollection === null) {
        const bookCollection = { nextId: 1, books: [] }
        return set(bookCollection);
    }
    return bookCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const bookCollection = get();
    const books = bookCollection.books;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = books.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `book with id ${id} not found` };
    }
    return { book: books[index] };
}

// set books in local storage
const set = (bookCollection) => {
    localStorage.setItem("books", JSON.stringify(bookCollection));
    return bookCollection;
};

// add a book to local storage
const add = (book) => {
    const bookCollection = get();
    book = { ...book, id: bookCollection.nextId };
    bookCollection.nextId++;
    bookCollection.books.push(book);
    set(bookCollection);
    return book;
};

// update a book in local storage
const update = (book) => {
    const bookCollection = get();

    const books = bookCollection.books;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = books.findIndex((r) => r.id == book.id);
    if (index === -1) {
        return { "error": `book with id ${book.id} not found` };
    }
    books[index] = book;
    set(bookCollection);
    return { bookCollection: bookCollection };
};

// delete a book from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const bookCollection = get();
    const books = bookCollection.books;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = books.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `book with id ${id} not found` };
    }
    books.splice(index, 1);
    set(bookCollection);
    return { bookCollection: bookCollection };
};

const bookUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { bookUtils };



