import { render, screen, waitFor } from "@testing-library/react";
import BookIndexPage from "main/pages/Books/BookIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
// for mocking /api/currentUser and /api/systemInfo
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";;
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    books: [
                        {
                            "id": 3,
                            "title": "The Kite Runner",
                            "author": "Khaled Hosseini",
                            "year": "2003"
                        },
                    ]
                }
            }
        }
    }
});


describe("BookIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createBookButton = screen.getByText("Create Book");
        expect(createBookButton).toBeInTheDocument();
        expect(createBookButton).toHaveAttribute("style", "float: right;");

        const title = screen.getByText("The Kite Runner");
        expect(title).toBeInTheDocument();

        const author = screen.getByText("Khaled Hosseini");
        expect(author).toBeInTheDocument();

        expect(screen.getByTestId("BookTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("BookTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("BookTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const title = screen.getByText("The Kite Runner");
        expect(title).toBeInTheDocument();

        const author = screen.getByText("Khaled Hosseini");
        expect(author).toBeInTheDocument();

        const deleteButton = screen.getByTestId("BookTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `BookIndexPage deleteCallback: {"id":3,"title":"The Kite Runner","author":"Khaled Hosseini","year":"2003"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});