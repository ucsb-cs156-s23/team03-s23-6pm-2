import React from 'react';
import DogForm from "main/components/Dogs/DogForm"
import { dogFixtures } from 'fixtures/dogFixtures';

export default {
    title: 'components/Dogs/DogForm',
    component: DogForm
};

const Template = (args) => {
    return (
        <DogForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Dogs: dogFixtures.oneDog,
    submitText: "",
    submitAction: () => { }
};
