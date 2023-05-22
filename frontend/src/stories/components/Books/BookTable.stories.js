import React from 'react';
import BookTable from 'main/components/Books/BookTable';
import { bookFixtures } from 'fixtures/bookFixtures';

export default {
    title: 'components/Books/BookTable',
    component: BookTable
};

const Template = (args) => {
    return (
        <BookTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    books: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    books: bookFixtures.threeBooks,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    books: bookFixtures.threeBooks,
    showButtons: true
};
