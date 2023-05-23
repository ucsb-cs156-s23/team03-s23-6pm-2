import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DogTable from 'main/components/Dogs/DogTable';
import { dogUtils } from 'main/utils/dogUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function DogIndexPage() {
    const navigate = useNavigate();

    const dogCollection = dogUtils.get();
    const dogs = dogCollection.dogs;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`DogIndexPage deleteCallback: ${showCell(cell)})`);
        dogUtils.del(cell.row.values.id);
        navigate("/dogs");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/dogs/create">
                    Create Dog
                </Button>
                <h1>Dogs</h1>
                <DogTable dogs={dogs} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}