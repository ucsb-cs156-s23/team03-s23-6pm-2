import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DogForm from "main/components/Dogs/DogForm";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast } from 'react-toastify';

export default function DogsCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (dog) => {
    const res = await axios.post("/api/dogs/post", null, {
      params: {
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
      },
    });
    const createdDog = res.data;
    toast(`New dog Created - id: ${createdDog.id} name: ${createdDog.name}`);
    navigate("/dogs");
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
