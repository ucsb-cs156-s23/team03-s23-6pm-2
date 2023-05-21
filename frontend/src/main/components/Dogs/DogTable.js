import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { dogUtils } from "main/utils/dogUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);


const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    dogUtils.del(cell.row.values.id);
}

export default function DogTable({
    dogs,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "DogTable" }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/dogs/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/dogs/details/${cell.row.values.id}`)
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Breed',
            accessor: 'breed',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ]

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return <OurTable
        data={dogs}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };
