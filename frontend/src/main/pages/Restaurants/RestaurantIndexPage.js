import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { restaurantUtils } from 'main/utils/restaurantUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function RestaurantIndexPage() {

    const navigate = useNavigate();

    const restaurantCollection = restaurantUtils.get();
    const restaurants = restaurantCollection.restaurants;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`RestaurantIndexPage deleteCallback: ${showCell(cell)})`);
        restaurantUtils.del(cell.row.values.id);
        navigate("/restaurants");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/restaurants/create">
                    Create Restaurant
                </Button>
                <h1>Restaurants</h1>
                <RestaurantTable restaurants={restaurants} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}