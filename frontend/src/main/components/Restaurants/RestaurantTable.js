import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "../../utils/useBackend";
import { hasRole } from "../../utils/currentUser";
import { toast } from "react-toastify";

export default function RestaurantTable({
  restaurants,
  showButtons = true,
  testIdPrefix = "RestaurantTable",
  currentUser = null,
}) {
  const handleDeleteSuccess = (message) => {
    console.log(message);
    toast(message);
  };

  const createAxiosParams = (cell) => ({
    url: "/api/Restaurant",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  });
  // Stryker disable all : don't test internal caching of React Query
  const deleteMutation = useBackendMutation(createAxiosParams, { onSuccess: handleDeleteSuccess }, [
    "/api/Restaurant/all",
  ]);
  // Stryker enable all 

  const handleDelete = async (cell) => {
    deleteMutation.mutate(cell);
    window.location.reload();

  };

  const navigate = useNavigate();

  const handleEdit = (cell) => {
    navigate(`/restaurants/edit/${cell.row.values.id}`);
  };

  const handleDetails = (cell) => {
    navigate(`/restaurants/details/${cell.row.values.id}`);
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
    <OurTable data={restaurants} columns={columns} testid={testIdPrefix} />
  );
}
