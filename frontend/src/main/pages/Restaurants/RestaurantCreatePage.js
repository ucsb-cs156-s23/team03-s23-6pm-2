import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { useNavigate } from 'react-router-dom'
import { restaurantUtils } from 'main/utils/restaurantUtils';

export default function RestaurantCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (restaurant) => {
    const createdRestaurant = restaurantUtils.add(restaurant);
    console.log("createdRestaurant: " + JSON.stringify(createdRestaurant));
    navigate("/restaurants");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Restaurant</h1>
        <RestaurantForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
