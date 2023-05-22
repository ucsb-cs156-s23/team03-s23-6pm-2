import { bookFixtures } from "fixtures/bookFixtures";
import { bookUtils } from "main/utils/bookUtils";

describe("bookUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "books".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "books") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When books is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.get();

            // assert
            const expected = { nextId: 1, books: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("books", expectedJSON);
        });

        test("When books is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.get();

            // assert
            const expected = { nextId: 1, books: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("books", expectedJSON);
        });

        test("When books is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, books: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.get();

            // assert
            const expected = { nextId: 1, books: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When books is JSON of three books, should return that JSON", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;
            const mockbookCollection = { nextId: 10, books: threeBooks };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockbookCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.get();

            // assert
            expect(result).toEqual(mockbookCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a book by id works", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;
            const idToGet = threeBooks[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            // act
            const result = bookUtils.getById(idToGet);

            // assert

            const expected = { book: threeBooks[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing book returns an error", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            // act
            const result = bookUtils.getById(99);

            // assert
            const expectedError = `book with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            // act
            const result = bookUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one book works", () => {

            // arrange
            const book = bookFixtures.oneBook[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, books: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.add(book);

            // assert
            expect(result).toEqual(book);
            expect(setItemSpy).toHaveBeenCalledWith("books",
                JSON.stringify({ nextId: 2, books: bookFixtures.oneBook }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing book works", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;
            const updatedbook = {
                ...threeBooks[0],
                title: "Updated Title"
            };
            const threeBooksUpdated = [
                updatedbook,
                threeBooks[1],
                threeBooks[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.update(updatedbook);

            // assert
            const expected = { bookCollection: { nextId: 5, books: threeBooksUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("books", JSON.stringify(expected.bookCollection));
        });
        test("Check that updating an non-existing book returns an error", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedbook = {
                id: 99,
                title: "Fake Title",
                author: "Fake Author",
                year: "Fake Year"
            }

            // act
            const result = bookUtils.update(updatedbook);

            // assert
            const expectedError = `book with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a book by id works", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;
            const idToDelete = threeBooks[1].id;
            const threeBooksUpdated = [
                threeBooks[0],
                threeBooks[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.del(idToDelete);

            // assert

            const expected = { bookCollection: { nextId: 5, books: threeBooksUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("books", JSON.stringify(expected.bookCollection));
        });
        test("Check that deleting a non-existing book returns an error", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = bookUtils.del(99);

            // assert
            const expectedError = `book with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeBooks = bookFixtures.threeBooks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, books: threeBooks }));

            // act
            const result = bookUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

