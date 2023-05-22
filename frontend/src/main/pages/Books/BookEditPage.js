import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { bookUtils }  from 'main/utils/bookUtils';
import BookForm from 'main/components/Books/BookForm';
import { useNavigate } from 'react-router-dom'


export default function BookEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = bookUtils.getById(id);

    const onSubmit = async (book) => {
        const updatedBook = bookUtils.update(book);
        console.log("updatedBook: " + JSON.stringify(updatedBook));
        navigate("/books");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Book</h1>
                <BookForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.book}/>
            </div>
        </BasicLayout>
    )
}