import React from 'react';
import DogTable from 'main/components/Dogs/DogTable';
import { dogFixtures } from 'fixtures/dogFixtures';

export default {
    title: 'components/Dogs/DogTable',
    component: DogTable
};

const Template = (args) => {
    return (
        <DogTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    dogs: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    dogs: dogFixtures.threeDogs,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    dogs: dogFixtures.threeDogs,
    showButtons: true
};
