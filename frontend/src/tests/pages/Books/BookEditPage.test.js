import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import BookEditPage from "main/pages/Books/BookEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            update: (_book) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    "book": {
                        id: 3,
                        title: "The Kite Runner",
                        author: "Khaled Hosseini",
                        year: "2003"
                    }
                }
            }
        }
    }
});


describe("BookEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // expect(screen.getByTestId("BookForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('The Kite Runner')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Khaled Hosseini')).toBeInTheDocument();
    });

    test("redirects to /books on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "book": {
                id: 3,
                title: "The Kite Runner",
                author: "Khaled Hosseini",
                year: "2003"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const authorInput = screen.getByLabelText("Author");
        expect(authorInput).toBeInTheDocument();

        const yearInput = screen.getByLabelText("Year");
        expect(yearInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'The Kite Runner' } })
            fireEvent.change(authorInput, { target: { value: 'Khaled Hosseini' } })
            fireEvent.change(yearInput, { target: { value: '2003' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedBook: {"book":{"id":3,"title":"The Kite Runner","author":"Khaled Hosseini","year":"2003"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});
