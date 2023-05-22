import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import BookTable from 'main/components/Books/BookTable';
import { bookUtils } from 'main/utils/bookUtils';

export default function BookDetailsPage() {
  let { id } = useParams();

  const response = bookUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Book Details</h1>
        <BookTable books={[response.book]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}