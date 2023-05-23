import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {useParams} from "react-router-dom";
import DogTable from 'main/components/Dogs/DogTable';
import {useBackend} from "../../utils/useBackend";

export default function DogDetailsPage() {
  let { id } = useParams();

  const { data: dog } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/dogs?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/dogs`,
        params: {id}
      }
    );

  const dogs = dog ? [dog] : [];

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Dog Details</h1>
        <DogTable dogs={dogs} showButtons={false}/>
      </div>
    </BasicLayout>
  );
}
