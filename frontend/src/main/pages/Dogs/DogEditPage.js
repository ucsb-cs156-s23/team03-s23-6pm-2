
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import DogForm from 'main/components/Dogs/DogForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function DogEditPage() {
  let { id } = useParams();

  const { data: dog } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/dogs?id=${id}`],
    {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/dogs`,
      params: {
        id
      }
    }
  );

  const axiosPutParams = (dog) => ({
    url: "/api/dogs",
    method: "PUT",
    params: {
      id: id,
    },
    data: {
      name: dog.name,
      breed: dog.breed,
    }
  });

  const onSuccess = (dog) => {
    toast(`Dog Updated - id: ${id} name: ${dog.name}`);
  }

  const mutation = useBackendMutation(
    axiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/dogs?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/dogs" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit dog</h1>
        {dog && <DogForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={dog}/>}
      </div>
    </BasicLayout>
  )
}