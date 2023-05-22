import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import DogTable from 'main/components/Dogs/DogTable';
import { dogUtils } from 'main/utils/dogUtils';

export default function DogDetailsPage() {
  let { id } = useParams();

  const response = dogUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Dog Details</h1>
        <DogTable dogs={[response.dog]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
