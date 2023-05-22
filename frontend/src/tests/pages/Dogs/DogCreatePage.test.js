import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import DogsCreatePage from "main/pages/Dogs/DogsCreatePage";
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

const mockAdd = jest.fn();
jest.mock('main/utils/dogUtils', () => {
    return {
        __esModule: true,
        dogUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("dogCreatePage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /dogs on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "dog": {
                id: 3,
                name: "Tom",
                breed: "German Shepherd"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const breedInput = screen.getByLabelText("Breed");
        expect(breedInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Tom' } })
            fireEvent.change(breedInput, { target: { value: 'German Shepherd' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dogs/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdDog: {"dog":{"id":3,"name":"Tom","breed":"German Shepherd"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


