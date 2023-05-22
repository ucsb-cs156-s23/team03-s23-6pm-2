import React from 'react';
import BookForm from "main/components/Books/BookForm"
import { bookFixtures } from 'fixtures/bookFixtures';

export default {
    title: 'components/Books/BookForm',
    component: BookForm
};

const Template = (args) => {
    return (
        <BookForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Books: bookFixtures.oneBook,
    submitText: "",
    submitAction: () => { }
};
