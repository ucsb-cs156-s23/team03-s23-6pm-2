import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import DogTable from "main/components/Dogs/DogTable";
import {dogFixtures} from "fixtures/dogFixtures";
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

describe("DogTable tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = ["Name", "Breed"];
  const expectedFields = ["name", "breed"];
  const testId = "DogTable";

  const renderTable = (dogs, currentUser) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DogTable dogs={dogs} currentUser={currentUser} />
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
           <DogTable dogs={dogFixtures.threeDogs} currentUser={currentUser}/>
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
 
     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Annie");
     expect(screen.getByTestId(`${testId}-cell-row-0-col-breed`)).toHaveTextContent("Poodle");
 
     expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Tom");
     expect(screen.getByTestId(`${testId}-cell-row-1-col-breed`)).toHaveTextContent("German Shepherd");
 
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
           <DogTable dogs={dogFixtures.threeDogs}
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
 
     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Annie");
     expect(screen.getByTestId(`${testId}-cell-row-0-col-breed`)).toHaveTextContent("Poodle");
 
     expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Tom");
     expect(screen.getByTestId(`${testId}-cell-row-1-col-breed`)).toHaveTextContent("German Shepherd");
 
     expect(screen.queryByText("Delete")).not.toBeInTheDocument();
     expect(screen.queryByText("Edit")).not.toBeInTheDocument();
     expect(screen.queryByText("Details")).not.toBeInTheDocument();
   });

 


   test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const dogs = dogFixtures.threeDogs;
  
    renderTable(dogs, currentUser);
  
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Annie");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-breed`)).toHaveTextContent("Poodle");
  
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
  
    fireEvent.click(editButton);
  
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/dogs/edit/Annie'));
  });

  test("Details button navigates to the details page", async () => {
    const dogs = dogFixtures.threeDogs;
  
    renderTable(dogs);
  
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Annie");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-breed`)).toHaveTextContent("Poodle");
  
    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
  
    fireEvent.click(detailsButton);
  
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/dogs/details/Annie'));
  });

  const axiosMock = new AxiosMockAdapter(axios);

  test("Delete button calls delete callback", async () => {
    const restoreConsole = mockConsole();
    axiosMock.onDelete('/api/dogs', {params: {name: "Annie"}}).reply(200, "Dog with name Annie was deleted");

    const currentUser = currentUserFixtures.adminUser;
    const dogs = dogFixtures.threeDogs;
  
    renderTable(dogs, currentUser);
  
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Annie");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-breed`)).toHaveTextContent("Poodle");
  
    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
  
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    
    await waitFor(() => {
      expect(axiosMock.history.delete[0].url).toBe('/api/dogs');
    });
  
    expect(console.log).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith("Dog with name Annie was deleted");
  
    restoreConsole();
  });
});
