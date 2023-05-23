import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "../../utils/useBackend";
import { toast } from "react-toastify";
import { hasRole } from "main/utils/currentUser";

export default function DogTable({
  dogs,
  showButtons = true,
  testIdPrefix = "DogTable",
  currentUser = null,
}) {

  const handleDeleteSuccess = (message) => {
    console.log(message);
    toast(message);
  };

  const createAxiosParams = (cell) => ({
    url: "/api/dogs",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  });
  // Stryker disable all : don't test internal caching of React Query
  const deleteMutation = useBackendMutation(createAxiosParams, { onSuccess: handleDeleteSuccess }, [
    "/api/dogs/all",
  ]);
  // Stryker enable all 

  const handleDelete = async (cell) => {
    deleteMutation.mutate(cell);
    window.location.reload();
  };

  const navigate = useNavigate();

  const handleEdit = (cell) => {
    navigate(`/dogs/edit/${cell.row.values.id}`);
  };

  const handleDetails = (cell) => {
    navigate(`/dogs/details/${cell.row.values.id}`);
  };

  const columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Breed",
      accessor: "breed",
    },
  ];

  if (showButtons) {
    columns.push(ButtonColumn("Details", "primary", handleDetails, testIdPrefix));
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      columns.push(
        ButtonColumn("Edit", "primary", handleEdit, testIdPrefix),
        ButtonColumn("Delete", "danger", handleDelete, testIdPrefix)
      );
    }
  }

  return (
    <OurTable data={dogs} columns={columns} testid={testIdPrefix} />
  );
}
