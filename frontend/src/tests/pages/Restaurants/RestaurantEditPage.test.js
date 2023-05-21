import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
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
jest.mock('main/utils/restaurantUtils', () => {
    return {
        __esModule: true,
        restaurantUtils: {
            update: (_restaurant) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    restaurant: {
                        id: 3,
                        name: "Freebirds",
                        description: "Burritos"
                    }
                }
            }
        }
    }
});


describe("RestaurantEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("RestaurantForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Freebirds')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Burritos')).toBeInTheDocument();
    });

    test("redirects to /restaurants on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "restaurant": {
                id: 3,
                name: "South Coast Deli (Goleta)",
                description: "Sandwiches, Salads and more"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'South Coast Deli (Goleta)' } })
            fireEvent.change(descriptionInput, { target: { value: 'Sandwiches, Salads and more' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/restaurants"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedRestaurant: {"restaurant":{"id":3,"name":"South Coast Deli (Goleta)","description":"Sandwiches, Salads and more"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


