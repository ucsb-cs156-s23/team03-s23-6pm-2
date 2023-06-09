import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DogCreatePage from 'main/pages/Dogs/DogCreatePage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import AxiosMockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { apiCurrentUserFixtures } from '../../../fixtures/currentUserFixtures';
import { systemInfoFixtures } from '../../../fixtures/systemInfoFixtures';

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe('DogCreatePage tests', () => {
  let queryClient;
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    queryClient = new QueryClient();

    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet('/api/currentUser').reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet('/api/systemInfo').reply(200, systemInfoFixtures.showingNeither);
  });

  test('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DogCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test('when filled in and submitted, makes request to backend and redirects to index page', async () => {
    const dog = {
      id: 3,
      name: 'Max',
      breed: 'Yorkie',
    };
    axiosMock.onPost('/api/dogs/post').reply(200, dog);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DogCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('DogForm-name')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toBeInTheDocument();

    const breedInput = screen.getByLabelText('Breed');
    expect(breedInput).toBeInTheDocument();

    const createButton = screen.getByText('Create');
    expect(createButton).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Max' } });
    fireEvent.change(breedInput, { target: { value: 'Yorkie' } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      ...dog,
      id: undefined,
    });

    expect(mockToast).toHaveBeenCalledWith('New dog Created - id: 3 name: Max');
    expect(mockNavigate).toHaveBeenCalledWith('/dogs');
  });
});
