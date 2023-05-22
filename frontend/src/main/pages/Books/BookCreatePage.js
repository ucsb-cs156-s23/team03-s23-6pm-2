import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookForm from "main/components/Books/BookForm";
import { useNavigate } from 'react-router-dom'
import { bookUtils } from 'main/utils/bookUtils';

export default function BookCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (book) => {
    const createdBook = bookUtils.add(book);
    console.log("createdBook: " + JSON.stringify(createdBook));
    navigate("/books");
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