import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import DogsCreatePage from "main/pages/Dogs/DogCreatePage";
import DogsEditPage from "main/pages/Dogs/DogEditPage";
import DogDetailsPage from "main/pages/Dogs/DogDetailsPage";
import DogIndexPage from "main/pages/Dogs/DogIndexPage";

import BookCreatePage from "main/pages/Books/BookCreatePage";
import BookEditPage from "main/pages/Books/BookEditPage";
import BookIndexPage from "main/pages/Books/BookIndexPage";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>

      <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
        <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
        <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
        <Route exact path="/restaurants/" element={<RestaurantIndexPage />} />




        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />


        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }

{
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/dogs" element={<DogIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/dogs/create" element={<DogsCreatePage />} />
              <Route exact path="/dogs/edit/:id" element={<DogsEditPage />} />
              <Route exact path="/dogs/details/:id" element={<DogDetailsPage />} />
            </>
          )
        }

{
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/books/list" element={<BookIndexPage />} />
              <Route exact path="/books/" element={<BookIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/books/create" element={<BookCreatePage />} />
              <Route exact path="/books/edit/:id" element={<BookEditPage />} />
              <Route exact path="/books/details/:id" element={<BookDetailsPage />} />
            </>
          )
        }
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
