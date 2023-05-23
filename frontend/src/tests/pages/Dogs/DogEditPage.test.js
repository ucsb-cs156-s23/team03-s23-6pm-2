import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DogEditPage from "main/pages/Dogs/DogEditPage";
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

describe("EditDogPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  describe("when API does not return a dog", () => {
    test("renders headline only", async () => {
      axiosMock.onGet("/api/dogs", { params: { id: 3 } }).timeout();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DogEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText("Edit dog");
      expect(screen.queryByTestId("DogForm-id")).not.toBeInTheDocument();
    });
  });

  describe("functional API", () => {
    beforeEach(() => {
      axiosMock.onGet("/api/dogs", { params: { id: 3 } }).reply(200, {
        name: "Max",
        breed: "Yorkie",
        id: 3,
      });
    });

    test("renders without crashing", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DogEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("populates form with existing dog data", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DogEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        const idField = screen.getByTestId("DogForm-id");
        expect(idField).toHaveValue("3");
      });

      const nameInput = screen.getByLabelText("Name");
      const breedInput = screen.getByLabelText("Breed");
      const updateButton = screen.getByText("Update");

      expect(nameInput).toHaveValue("Max");
      expect(breedInput).toHaveValue("Yorkie");
      expect(updateButton).toBeInTheDocument();
    });

    test("on form submit, calls API and navigates to dog list", async () => {
      axiosMock.onPut("/api/dogs").reply(200, {
        id: "3",
        name: "Max",
        breed: "Yorkie",
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DogEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(async () => {
        const idField = await screen.findByTestId("DogForm-id");
        expect(idField).toHaveValue("3");
      });

      const nameInput = screen.getByLabelText("Name");
      const breedInput = screen.getByLabelText("Breed");
      const updateButton = screen.getByText("Update");

      expect(nameInput).toHaveValue("Max");
      expect(breedInput).toHaveValue("Yorkie");
      expect(updateButton).toBeInTheDocument();

      fireEvent.change(nameInput, { target: { value: "Max" } });
      fireEvent.change(breedInput, { target: { value: "Yorkie" } });

      fireEvent.click(updateButton);

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith(
          "Dog Updated - id: 3 name: Max"
        )
      );
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/dogs",
        })
      );

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 3});
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          name: "Max",
          breed: "Yorkie",
        })
      );
    });
  });
});
