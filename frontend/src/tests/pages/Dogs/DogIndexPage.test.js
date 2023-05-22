import { render, screen, waitFor } from "@testing-library/react";
import DogIndexPage from "main/pages/Dogs/DogIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/dogUtils', () => {
    return {
        __esModule: true,
        dogUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    dogs: [
                        {
                            "id": 3,
                            "name": "Tom",
                            "breed": "German Shepherd",
                            "gender": "Male"   
                        },
                    ]
                }
            }
        }
    }
});


describe("DogIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createDogButton = screen.getByText("Create Dog");
        expect(createDogButton).toBeInTheDocument();
        expect(createDogButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("Tom");
        expect(name).toBeInTheDocument();

        const breed = screen.getByText("German Shepherd");
        expect(breed).toBeInTheDocument();

        expect(screen.getByTestId("DogTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("DogTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("DogTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Tom");
        expect(name).toBeInTheDocument();

        const breed = screen.getByText("German Shepherd");
        expect(breed).toBeInTheDocument();

        const deleteButton = screen.getByTestId("DogTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dogs/list"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `DogIndexPage deleteCallback: {"id":3,"name":"Tom","breed":"German Shepherd"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


