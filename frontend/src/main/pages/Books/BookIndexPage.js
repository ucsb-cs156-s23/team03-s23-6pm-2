import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookTable from 'main/components/Books/BookTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function BookIndexPage() {

  const currentUser = useCurrentUser();

  const { data: books, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/books/all"],
      { method: "GET", url: "/api/books/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Books</h1>
        <BookTable books={books} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}