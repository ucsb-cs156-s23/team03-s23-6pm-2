import DogIndexPage from "main/pages/Dogs/DogIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import mockConsole from "jest-mock-console";
import AxiosMockAdapter from "axios-mock-adapter";
import { dogFixtures } from "../../../fixtures/dogFixtures";
import axios from "axios";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("DogIndexPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const testId = "DogTable";

    let queryClient;
    beforeEach(() => {
        queryClient = new QueryClient();
    });

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for normal user", () => {
        setupUserOnly();
        axiosMock.onGet("/api/dogs/all").reply(200, []);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin", () => {
        setupAdminUser();
        axiosMock.onGet("/api/dogs/all").reply(200, []);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders three dogs correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/dogs/all").reply(200, dogFixtures.threeDogs);

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

        await waitFor(() => {
            const name = screen.getByText("Annie");
            expect(name).toBeInTheDocument();
        });

        const breed = screen.getByText("Poodle");
        expect(breed).toBeInTheDocument();


        expect(screen.getByTestId("DogTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.queryByTestId("DogTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("DogTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders three dogs correctly for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/dogs/all").reply(200, dogFixtures.threeDogs);

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

        await waitFor(() => {
            const name = screen.getByText("Annie");
            expect(name).toBeInTheDocument();
        });

        const breed = screen.getByText("Poodle");
        expect(breed).toBeInTheDocument();
        expect(screen.getByTestId("DogTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("DogTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("DogTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });
    test("renders empty table when backend unavailable", async () => {
        setupUserOnly();
        const restoreConsole = mockConsole();
        axiosMock.onGet("/api/dogs/all").timeout();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DogIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1));

        expect(console.error).toHaveBeenCalledWith(
            expect.stringMatching("Error communicating with backend via GET on /api/dogs/all"),
            expect.anything()
        );
        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-id`)).not.toBeInTheDocument();
    });

});
