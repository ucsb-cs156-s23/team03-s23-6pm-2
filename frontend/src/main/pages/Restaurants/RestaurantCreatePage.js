import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const createRestaurant = async (restaurant) => {
  try {
    const response = await axios.post("/api/Restaurant/post", null, {
      params: {
        name: restaurant.name,
        description: restaurant.description,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error creating restaurant: ${error.response.statusText}`);
  }
};

export default function RestaurantCreatePage() {
  let navigate = useNavigate();

  const onSubmit = async (restaurant) => {
    try {
      const createdRestaurant = await createRestaurant(restaurant);
      console.log("createdRestaurant: " + JSON.stringify(createdRestaurant));
      navigate("/restaurants");
    } catch (error) {
      console.error("Error creating restaurant: ", error);
    }
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