import React from 'react';
import PropTypes from 'prop-types';
import { getTime } from '../../utils';
import AppConstants from '../../app-constants';
import './feed.scss';

function Feed(props) {
  const { isUpvoted, feed } = props;
  const {
    num_comments: numComments,
    points,
    title,
    url,
    author,
    created_at: cat,
    created_at_i: cati,
    objectID,
  } = feed;

  let pointsClass = 'low';
  if (points > 100) { pointsClass = 'high'; } else if (points > 50) { pointsClass = 'medium'; }

  const storyUrl = url ? `${url.match(/:\/\/(.[^/]+)/)[1]}` : '';
  return (
    <>
      <td className="commentsNumber" title="comments">
        {numComments || '-'}
      </td>
      <td className="upvoteContainer">
        <span className={pointsClass} title="upvotes">
          {points || '-'}
        </span>
        <button type="button" className={`upvoteAction ${isUpvoted ? 'upvoted' : ''}`} onClick={() => { props.upvote(objectID); }} title={`${isUpvoted ? 'unvote' : 'upvote'}`}>
          <span className="arrow" />
        </button>
      </td>
      <td className="content">
        <h5 className="title">
          {title || ''}
        </h5>
        <a className="domain" href={`https://${storyUrl}`} target="blank">
          {`(${storyUrl})`}
        </a>
        <address className="author">
          <span>{AppConstants.BY}</span>
          {' '}
          {author || ''}
        </address>
        <time className="time">
          {cat ? getTime(cat) : ''}
        </time>
        <button type="button" className="hideButton" onClick={() => { props.hide(cati); }} title="hide feed">
          [
          {' '}
          <span>{AppConstants.HIDE}</span>
          {' '}
          ]
        </button>
      </td>
    </>
  );
}

Feed.propTypes = {
  isUpvoted: PropTypes.bool.isRequired,
  feed: PropTypes.shape({
    num_comments: PropTypes.number,
    points: PropTypes.number,
    title: PropTypes.string,
    url: PropTypes.string,
    author: PropTypes.string,
    created_at: PropTypes.string,
    created_at_i: PropTypes.number,
    objectID: PropTypes.string,
  }).isRequired,
  upvote: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};

export default Feed;
