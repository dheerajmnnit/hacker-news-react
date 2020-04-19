import React from 'react';
import { shallow } from 'enzyme';
import Feed from './index';


it('renders with empty feed object', () => {
  const wrapper = shallow(<Feed isUpvoted={false} feed={{}} upvote={jest.fn()} hide={jest.fn()} />);
  expect(wrapper.find('.commentsNumber').text()).toBe('-');
});

it('renders provided values correctly', () => {
  const feed = {
    num_comments: 1,
    points: 2,
    title: 'Abc',
    url: '',
    author: '',
    created_at: '',
    created_at_i: 12345,
    objectID: 'ABC',
  };
  const upvote = jest.fn();
  const hide = jest.fn();

  const wrapper = shallow(<Feed isUpvoted feed={feed} upvote={upvote} hide={hide} />);
  expect(wrapper.find('.title').text()).toBe('Abc');

  wrapper.find('.upvoteAction').simulate('click');
  expect(upvote).toHaveBeenCalledTimes(1);

  wrapper.find('.hideButton').simulate('click');
  expect(hide).toHaveBeenCalledTimes(1);

  expect(wrapper.find('.upvoteAction').hasClass('upvoted')).toBe(true);
  wrapper.setProps({ isUpvoted: false });
  expect(wrapper.find('.upvoteAction').hasClass('upvoted')).toBe(false);
});
