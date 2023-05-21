import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

const showCell = (cell) => JSON.stringify(cell.row.values);

export default function RestaurantTable({
  restaurants,
  showButtons = true,
  testIdPrefix = "RestaurantTable",
}) {
  const navigate = useNavigate();

  const onDeleteSuccess = message => {
    console.log(message);
    toast.success(`Restaurant successfully deleted`);

  };

  const objectToAxiosParams = function (cell) {
    return {
      url: "/api/Restaurant",
      method: "DELETE",
      params: {
        id: cell.row.values.id
      }
    };
  };

  const deleteMutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess: onDeleteSuccess },
    ["/api/Restaurant/all"]
  );

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const editCallback = (cell) => {
    console.log(`editCallback: ${showCell(cell)})}`);
    navigate(`/Restaurants/edit/${cell.row.values.id}`);
  };

  const detailsCallback = (cell) => {
    console.log(`detailsCallback: ${showCell(cell)})}`);
    navigate(`/Restaurants/details/${cell.row.values.id}`);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
  ];

  const buttonColumns = [
    ...columns,
    ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
    ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
    ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
  ];

  const columnsToDisplay = showButtons ? buttonColumns : columns;

  return (
    <OurTable
      data={restaurants}
      columns={columnsToDisplay}
      testid={testIdPrefix}
    />
  );
}

export { showCell };