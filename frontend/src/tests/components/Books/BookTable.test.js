import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import BookTable from "main/components/Books/BookTable";
import {bookFixtures} from "fixtures/bookFixtures";
import {currentUserFixtures} from "../../../fixtures/currentUserFixtures";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x)
  };
});

describe("BookTable tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = ["Id", "Title", "Author", "Year"];
  const expectedFields = ["id", "title", "author", "year"];
  const testId = "BookTable";

  const renderTable = (books, currentUser) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BookTable books={books} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  test("renders without crashing for empty table with user not logged in", () => {
    renderTable([], null);
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;
    renderTable([], currentUser);
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;
    renderTable([], currentUser);
  });

  test("Has the expected column headers, content, and buttons for admin user", () => {
     const currentUser = currentUserFixtures.adminUser;
 
     render(
       <QueryClientProvider client={queryClient}>
         <MemoryRouter>
           <BookTable books={bookFixtures.threeBooks} currentUser={currentUser}/>
         </MemoryRouter>
       </QueryClientProvider>
     );
 
     expectedHeaders.forEach((headerText) => {
       const header = screen.getByText(headerText);
       expect(header).toBeInTheDocument();
     });
 
     expectedFields.forEach((field) => {
       const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
       expect(header).toBeInTheDocument();
     });
 
     expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
     expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Lord of the Rings");
 
     expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
     expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("The Kite Runner");
 
     const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
     expect(detailsButton).toBeInTheDocument();
     expect(detailsButton).toHaveClass("btn-primary");
 
     const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
     expect(editButton).toBeInTheDocument();
     expect(editButton).toHaveClass("btn-primary");
 
     const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
     expect(deleteButton).toBeInTheDocument();
     expect(deleteButton).toHaveClass("btn-danger");
   });
 
 
   test("Has the expected column headers, content and no buttons when showButtons=false", () => {
     const currentUser = currentUserFixtures.adminUser;
     render(
       <QueryClientProvider client={queryClient}>
         <MemoryRouter>
           <BookTable books={bookFixtures.threeBooks}
                            showButtons={false}
                            currentUser={currentUser}/>
         </MemoryRouter>
       </QueryClientProvider>
     );
 
     expectedHeaders.forEach((headerText) => {
       const header = screen.getByText(headerText);
       expect(header).toBeInTheDocument();
     });
 
     expectedFields.forEach((field) => {
       const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
       expect(header).toBeInTheDocument();
     });
 
     expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
     expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Lord of the Rings");
 
     expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
     expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("The Kite Runner");
 
     expect(screen.queryByText("Delete")).not.toBeInTheDocument();
     expect(screen.queryByText("Edit")).not.toBeInTheDocument();
     expect(screen.queryByText("Details")).not.toBeInTheDocument();
   });

   test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const books = bookFixtures.threeBooks;
  
    renderTable(books, currentUser);
  
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Lord of the Rings");
  
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
  
    fireEvent.click(editButton);
  
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/books/edit/2'));
  });

  test("Details button navigates to the details page", async () => {
    const books = bookFixtures.threeBooks;
  
    renderTable(books);
  
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Lord of the Rings");
  
    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
  
    fireEvent.click(detailsButton);
  
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/books/details/2'));
  });

  const axiosMock = new AxiosMockAdapter(axios);

  test("Delete button calls delete callback", async () => {
    const restoreConsole = mockConsole();
    axiosMock.onDelete('/api/books', {params: { id: 2 }}).reply(200, "Book with id 2 was deleted");

    const currentUser = currentUserFixtures.adminUser;
    const books = bookFixtures.threeBooks;
  
    renderTable(books, currentUser);
  
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Lord of the Rings");
  
    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
  
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    
    await waitFor(() => {
      expect(axiosMock.history.delete[0].url).toBe('/api/books');
    });
  
    expect(console.log).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith("Book with id 2 was deleted");
  
    restoreConsole();
  });
});
