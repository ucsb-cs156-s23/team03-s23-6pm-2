import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {Navigate, useParams} from "react-router-dom";
import RestaurantForm from 'main/components/Restaurants/RestaurantForm';
import {toast} from "react-toastify";
import {useBackend, useBackendMutation} from "../../utils/useBackend";

export default function RestaurantEditPage() {
  let {id} = useParams();
  const {data: restaurant} =     useBackend(
    [`/api/Restaurant?id=${id}`],
    {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/Restaurant`,
      params: {id}
    }
  );

  const objectToAxiosPutParams = (restaurant) => ({
    url: "/api/Restaurant",
    method: "PUT",
    params: {id: restaurant.id},
    data: {
      name: restaurant.name,
      description: restaurant.description,
    }
  });

  const onSuccess = (restaurant) => {
    toast(`Restaurant Updated - id: ${restaurant.id} name: ${restaurant.name}`);
  };

  const mut = useBackendMutation(objectToAxiosPutParams, {onSuccess}, [`/api/restaurants?id=${id}`]);
  const onSubmit = async (restaurant) => {
    mut.mutate(restaurant);
  };

  if (mut.isSuccess) {
    return <Navigate to="/restaurants"/>;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Restaurant</h1>
        {
          restaurant &&
          <RestaurantForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={restaurant}/>
        }
      </div>
    </BasicLayout>
  );
}