import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DogForm from "main/components/Dogs/DogForm";
import { useNavigate } from 'react-router-dom'
import { dogUtils } from 'main/utils/dogUtils';

export default function DogsCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (dog) => {
    const createdDog = dogUtils.add(dog);
    console.log("createdDog: " + JSON.stringify(createdDog));
    navigate("/dogs/list");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Dog!</h1>
        <DogForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
