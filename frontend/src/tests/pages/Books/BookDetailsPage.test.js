import {render, screen, waitFor} from "@testing-library/react";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";
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
      id: 2
    }),
  };
});

describe("BookDetailsPage tests", () => {

  let queryClient;
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders headers only when backend doesn't return a book", async () => {
    axiosMock.onGet("/api/books", {params: { id: 2 }}).timeout();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookDetailsPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await screen.findByText("Book Details");
    const expectedHeaders = ["id", "title", "author", "year"];
    expectedHeaders.forEach((header) => {
      expect(screen.getByTestId(`BookTable-header-${header}`)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("BookTable-cell-row-0-col-id")).not.toBeInTheDocument();
  });

  describe("when backend returns a book", () => {
    beforeEach(() => {
      axiosMock.onGet("/api/books", {params: { id: 2 }}).reply(200, {
        id: 2,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: "1954"
      });
    });

    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <BookDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("loads the correct fields, and has no buttons", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <BookDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("The Lord of the Rings")).toBeInTheDocument();
      });

      expect(screen.getByText("The Lord of the Rings")).toBeInTheDocument();
      expect(screen.getByText("J.R.R. Tolkien")).toBeInTheDocument();
      expect(screen.getByText("1954")).toBeInTheDocument();

      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

  });
});