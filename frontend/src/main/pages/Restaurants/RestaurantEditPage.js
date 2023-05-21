
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { restaurantUtils }  from 'main/utils/restaurantUtils';
import RestaurantForm from 'main/components/Restaurants/RestaurantForm';
import { useNavigate } from 'react-router-dom'


export default function RestaurantEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = restaurantUtils.getById(id);

    const onSubmit = async (restaurant) => {
        const updatedRestaurant = restaurantUtils.update(restaurant);
        console.log("updatedRestaurant: " + JSON.stringify(updatedRestaurant));
        navigate("/restaurants");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Restaurant</h1>
                <RestaurantForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.restaurant}/>
            </div>
        </BasicLayout>
    )
}