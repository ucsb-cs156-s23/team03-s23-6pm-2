import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import { apiCurrentUserFixtures } from "../../../fixtures/currentUserFixtures";
import { systemInfoFixtures } from "../../../fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 3,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("EditRestaurantPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  describe("when API does not return a restaurant", () => {
    test("renders headline only", async () => {
      axiosMock.onGet("/api/Restaurant", { params: { id: 3 } }).timeout();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText("Edit Restaurant");
      expect(screen.queryByTestId("RestaurantForm-name")).not.toBeInTheDocument();
    });
  });

  describe("functional API", () => {
    beforeEach(() => {
      axiosMock.onGet("/api/Restaurant", { params: { id: 3 } }).reply(200, {
        name: "Freebirds",
        description: "Burritos",
        id: 3,
      });
    });

    test("renders without crashing", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("populates form with existing restaurant data", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        const idField = screen.getByTestId("RestaurantForm-id");
        expect(idField).toHaveValue("3");
      });

      const nameInput = screen.getByLabelText("Name");
      const descriptionInput = screen.getByLabelText("Description");
      const updateButton = screen.getByText("Update");

      expect(nameInput).toHaveValue("Freebirds");
      expect(descriptionInput).toHaveValue("Burritos");
      expect(updateButton).toBeInTheDocument();
    });

    test("on form submit, calls API and navigates to restaurant list", async () => {
      axiosMock.onPut("/api/Restaurant").reply(200, {
        name: "JONAHTNAN",
        description: "Big buff",
        id: "3",
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(async () => {
        const idField = await screen.findByTestId("RestaurantForm-id");
        expect(idField).toHaveValue("3");
      });

      const nameInput = screen.getByLabelText("Name");
      const descriptionInput = screen.getByLabelText("Description");
      const updateButton = screen.getByText("Update");

      expect(nameInput).toHaveValue("Freebirds");
      expect(descriptionInput).toHaveValue("Burritos");
      expect(updateButton).toBeInTheDocument();

      fireEvent.change(nameInput, { target: { value: "JONAHTNAN" } });
      fireEvent.change(descriptionInput, { target: { value: "Big buff" } });

      fireEvent.click(updateButton);

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith(
          "Restaurant Updated - id: 3 name: JONAHTNAN"
        )
      );
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/restaurants",
        })
      );

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "JONAHTNAN",
          description: "Big buff",
        })
      );
    });
  });
});