import {render, screen, waitFor} from "@testing-library/react";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 3
    }),
  };
});

describe("RestaurantDetailsPage tests", () => {

  let queryClient;
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders headers only when backend doesn't return a restaurant", async () => {
    axiosMock.onGet("/api/Restaurant", {params: {id: 3}}).timeout();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantDetailsPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await screen.findByText("Restaurant Details");
    const expectedHeaders = ["id", "name", "description"];
    expectedHeaders.forEach((header) => {
      expect(screen.getByTestId(`RestaurantTable-header-${header}`)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("RestaurantTable-cell-row-0-col-id")).not.toBeInTheDocument();
  });

  describe("when backend returns a restaurant", () => {
    beforeEach(() => {
      axiosMock.onGet("/api/Restaurant", {params: {id: 3}}).reply(200, {
        id: 3,
        name: "Freebirds",
        description: "Burritos",
      });
    });

    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("loads the correct fields, and has no buttons", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Freebirds")).toBeInTheDocument();
      });

      expect(screen.getByText("Freebirds")).toBeInTheDocument();
      expect(screen.getByText("Burritos")).toBeInTheDocument();

      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

  });
});