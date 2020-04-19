import React from 'react';
import { shallow } from 'enzyme';
import Feedview from './index';


it('renders api data', () => {
  const fakeData = [{
    num_comments: 1,
    points: 2,
    title: 'Abc',
    url: '',
    author: '',
    created_at: '',
    created_at_i: 12345,
    objectID: 'ABC',
  }];

  global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    json: () => Promise.resolve({}),
  }));


  const wrapper = shallow(<Feedview />);
  wrapper.setState({
    isLoad: false,
    feeds: fakeData,
  });
  expect(wrapper.find('Feed')).toHaveLength(1);
});
