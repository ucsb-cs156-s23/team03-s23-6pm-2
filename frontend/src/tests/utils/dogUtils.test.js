import { dogFixtures } from "fixtures/dogFixtures";
import { dogUtils } from "main/utils/dogUtils";

describe("dogUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "dogs".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "dogs") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When dogs is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.get();

            // assert
            const expected = { nextId: 1, dogs: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("dogs", expectedJSON);
        });

        test("When dogs is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.get();

            // assert
            const expected = { nextId: 1, dogs: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("dogs", expectedJSON);
        });

        test("When dogs is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, dogs: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.get();

            // assert
            const expected = { nextId: 1, dogs: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When dogs is JSON of three dogs, should return that JSON", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;
            const mockdogCollection = { nextId: 10, dogs: threeDogs };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockdogCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.get();

            // assert
            expect(result).toEqual(mockdogCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a dog by id works", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;
            const idToGet = threeDogs[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            // act
            const result = dogUtils.getById(idToGet);

            // assert

            const expected = { dog: threeDogs[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing dog returns an error", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            // act
            const result = dogUtils.getById(99);

            // assert
            const expectedError = `dog with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            // act
            const result = dogUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one dog works", () => {

            // arrange
            const dog = dogFixtures.oneDog[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, dogs: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.add(dog);

            // assert
            expect(result).toEqual(dog);
            expect(setItemSpy).toHaveBeenCalledWith("dogs",
                JSON.stringify({ nextId: 2, dogs: dogFixtures.oneDog }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing dog works", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;
            const updateddog = {
                ...threeDogs[0],
                name: "Updated Name"
            };
            const threeDogsUpdated = [
                updateddog,
                threeDogs[1],
                threeDogs[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.update(updateddog);

            // assert
            const expected = { dogCollection: { nextId: 5, dogs: threeDogsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("dogs", JSON.stringify(expected.dogCollection));
        });
        test("Check that updating an non-existing dog returns an error", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updateddog = {
                id: 99,
                name: "Fake Name",
                ownerName: "Fake ownerName"
            }

            // act
            const result = dogUtils.update(updateddog);

            // assert
            const expectedError = `dog with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a dog by id works", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;
            const idToDelete = threeDogs[1].id;
            const threeDogsUpdated = [
                threeDogs[0],
                threeDogs[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.del(idToDelete);

            // assert

            const expected = { dogCollection: { nextId: 5, dogs: threeDogsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("dogs", JSON.stringify(expected.dogCollection));
        });
        test("Check that deleting a non-existing dog returns an error", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = dogUtils.del(99);

            // assert
            const expectedError = `dog with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeDogs = dogFixtures.threeDogs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, dogs: threeDogs }));

            // act
            const result = dogUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

