import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DogTable from 'main/components/Dogs/DogTable';
import { Link } from 'react-router-dom';
import { useBackend } from 'main/utils/useBackend';
import { useCurrentUser } from 'main/utils/currentUser';

export default function DogIndexPage() {
  // Stryker disable all : don't test internal caching of React Query
  const { data: dogs } = useBackend(
  
    ["Get all dogs"],
    {method: "GET", url: "/api/dogs/all"},
    []
  );;
  // Stryker enable all
  const currentUser = useCurrentUser();

  return (
    <BasicLayout>
      <div className="pt-2">
        <Button style={{ float: "right" }} as={Link} to="/dogs/create">
          Create Dog
        </Button>
        <h1>Dogs</h1>
        <DogTable dogs={dogs} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}
