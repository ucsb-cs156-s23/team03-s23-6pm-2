import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookForm from "main/components/Books/BookForm";
import { Navigate } from 'react-router-dom'
import { bookUtils } from 'main/utils/bookUtils';
import axios from "axios";
import { toast } from 'react-toastify';
import { useBackendMutation } from "main/utils/useBackend";

export default function BookCreatePage() {

  const objectToAxiosParams = (book) => ({
    url: "/api/books/post",
    method: "POST",
    params: {
      title: book.title,
      author: book.author,
      year: book.year

    }

  });

  const onSuccess = (book) => {
    toast(`New book created - id: ${book.id} title: ${book.title}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/books/all"]
  );
  
  const { isSuccess } = mutation
  
  const onSubmit = async (data) => {
    mutation.mutate(data);
  }  

  if (isSuccess) {
    return <Navigate to="/books/list"/>
  }


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Book</h1>
        <BookForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}