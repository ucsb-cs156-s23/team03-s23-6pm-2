import {render, screen, waitFor} from "@testing-library/react";
import DogDetailsPage from "main/pages/Dogs/DogDetailsPage";
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
      name: "Annie"
    }),
  };
});

describe("DogDetailsPage tests", () => {

  let queryClient;
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders headers only when backend doesn't return a dog", async () => {
    axiosMock.onGet("/api/dogs", {params: { name: "Annie" }}).timeout();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DogDetailsPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await screen.findByText("Dog Details");
    const expectedHeaders = ["name", "breed"];
    expectedHeaders.forEach((header) => {
      expect(screen.getByTestId(`DogTable-header-${header}`)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("DogTable-cell-row-0-col-id")).not.toBeInTheDocument();
  });

  describe("when backend returns a dog", () => {
    beforeEach(() => {
      axiosMock.onGet("/api/dogs", {params: { name: "Annie" }}).reply(200, {
        name: "Annie",
        breed: "Poodle",
      });
    });

    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DogDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("loads the correct fields, and has no buttons", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <DogDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Annie")).toBeInTheDocument();
      });

      expect(screen.getByText("Annie")).toBeInTheDocument();
      expect(screen.getByText("Poodle")).toBeInTheDocument();

      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

  });
});
