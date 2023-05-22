
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { dogUtils }  from 'main/utils/dogUtils';
import DogForm from 'main/components/Dogs/DogForm';
import { useNavigate } from 'react-router-dom'


export default function DogEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = dogUtils.getById(id);

    const onSubmit = async (dog) => {
        const updateddog = dogUtils.update(dog);
        console.log("updateddog: " + JSON.stringify(updateddog));
        navigate("/dogs/list");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit dog</h1>
                <DogForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.dog}/>
            </div>
        </BasicLayout>
    )
}