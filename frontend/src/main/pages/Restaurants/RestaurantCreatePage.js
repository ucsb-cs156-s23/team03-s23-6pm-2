import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const createRestaurant = async (restaurant) => {

    const response = await axios.post("/api/Restaurant/post", null, {
      params: {
        name: restaurant.name,
        description: restaurant.description,
      },
    });

    return response.data;
  
};

export default function RestaurantCreatePage() {
  let navigate = useNavigate();

  const onSubmit = async (restaurant) => {
    
      const createdRestaurant = await createRestaurant(restaurant);
      console.log("createdRestaurant: " + JSON.stringify(createdRestaurant));
      toast(`New restaurant Created - id: ${createdRestaurant.id} name: ${createdRestaurant.name}`);
      navigate("/restaurants");

  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Restaurant</h1>
        <RestaurantForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}