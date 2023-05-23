import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {useParams} from "react-router-dom";
import BookTable from 'main/components/Books/BookTable';
import {useBackend} from "../../utils/useBackend";

export default function BookDetailsPage() {
  let { id } = useParams();

  const { data: book } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/books?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/books`,
        params: {id}
      }
    );

  const books = book ? [book] : [];

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Book Details</h1>
        <BookTable books={books} showButtons={false}/>
      </div>
    </BasicLayout>
  );
}