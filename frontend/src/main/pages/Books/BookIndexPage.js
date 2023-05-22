import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookTable from 'main/components/Books/BookTable';
import { bookUtils } from 'main/utils/bookUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function BookIndexPage() {

    const navigate = useNavigate();

    const bookCollection = bookUtils.get();
    const books = bookCollection.books;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`BookIndexPage deleteCallback: ${showCell(cell)})`);
        bookUtils.del(cell.row.values.id);
        navigate("/books");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/books/create">
                    Create Book
                </Button>
                <h1>Books</h1>
                <BookTable books={books} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}