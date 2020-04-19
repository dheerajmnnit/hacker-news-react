import React from 'react';
import Feed from '../Feed';
import { getQueryStringValue } from '../../utils';
import AppConstants from '../../app-constants';

import './feedview.scss';
import logo from './y18.png';

class FeedView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feeds: [],
      page: 1,
      disableMore: false,
      isLoad: false,
      sortType: 'search',
    };

    this.upvotesArr = [];
    this.hiddenFeedsArr = [];
    this.pageSize = 30;

    this.upvote = this.upvote.bind(this);
    this.hideFeed = this.hideFeed.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoad: true,
    });

    this.upvotesArr = JSON.parse(localStorage.getItem('upvotes') || '[]');
    this.hiddenFeedsArr = JSON.parse(localStorage.getItem('hiddenFeeds') || '[]');

    this.fetchData();
  }

  fetchData() {
    // This function handle api calls, It can moved to separate module in complex apps
    const sort = getQueryStringValue('sort') || 'search';
    const pageNum = getQueryStringValue('page') || 1;
    const url = `https://hn.algolia.com/api/v1/${sort}?hitsPerPage=${this.pageSize}&tags=story&page=${pageNum}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.syncLocalStorage(data.hits, pageNum, sort);
      })
      .catch(() => {});
  }

  updateFeedsFromLS(feedArr, page, sort) {
    const newArr = feedArr.map((obj) => {
      const feed = { ...obj };
      feed.points = feed.points || 0;
      if (this.upvotesArr.indexOf(feed.objectID) >= 0) {
        feed.points += 1;
      }
      return feed;
    });

    this.setState({
      feeds: newArr,
      isLoad: false,
      sortType: sort,
      page,
    });
  }

  syncLocalStorage(feeds, page, sort) {
    // This function hidden feeds from local storage
    const feedArr = feeds.filter((feed) => this.hiddenFeedsArr.indexOf(feed.created_at_i) < 0);
    if (feedArr.length < this.pageSize) {
      const diff = this.pageSize - feedArr.length;
      const low = Math.min(...this.hiddenFeedsArr);
      fetch(`https://hn.algolia.com/api/v1/${sort}?hitsPerPage=${diff}&tags=story&page=${page}&numericFilters=created_at_i<${low}`)
        .then((r) => r.json())
        .then((d) => {
          feedArr.push(...d.hits);
          this.updateFeedsFromLS(feedArr, page, sort);
        });
    } else {
      this.updateFeedsFromLS(feedArr, page, sort);
    }
  }

  upvote(objectID) {
    const { feeds } = this.state;
    const feedObj = feeds.filter((f) => f.objectID === objectID)[0];
    if (this.upvotesArr.indexOf(objectID) >= 0) {
      feedObj.points -= 1;
      this.upvotesArr.splice(this.upvotesArr.indexOf(objectID), 1);
    } else {
      feedObj.points += 1;
      this.upvotesArr.push(objectID);
    }
    this.setState({
      feeds: [...feeds],
    });
    localStorage.setItem('upvotes', JSON.stringify(this.upvotesArr));
  }

  hideFeed(createdTime) {
    // const {feeds, page, sortType} = this.state
    if (this.hiddenFeedsArr.indexOf(createdTime) < 0) {
      this.hiddenFeedsArr.push(createdTime);
    }
    localStorage.setItem('hiddenFeeds', JSON.stringify(this.hiddenFeedsArr));
    // this.syncLocalStorage(feeds, page, sortType);
    this.fetchData();
  }

  render() {
    const {
      isLoad, disableMore, feeds, page, sortType,
    } = this.state;
    return (
      <div className="feedsTable">
        {isLoad ? (
          <div className="loader">{AppConstants.DATA_LOAD}</div>
        ) : (
          <table data-testid="feedtable">
            <thead>
              <tr>
                <td className="header" colSpan="3">
                  <img alt="logo" src={logo} />
                  <span className="topNavLinks">
                    <a className={sortType === 'search' ? 'selected' : ''} href="?sort=search">
                      {AppConstants.TOP}
                    </a>
                    |
                    <a className={sortType === 'search_by_date' ? 'selected' : ''} href="?sort=search_by_date">
                      {AppConstants.NEW}
                    </a>
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              {feeds.map((feed) => (
                <tr key={`feed-${feed.objectID}`} className="feedContainer">
                  <Feed
                    feed={feed}
                    upvote={this.upvote}
                    hide={this.hideFeed}
                    isUpvoted={this.upvotesArr.indexOf(feed.objectID) >= 0}
                  />
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="feedContainer">
                <td colSpan="3">
                  {!disableMore && (
                    <a href={`?hitsPerPage=${this.pageSize}&sort=${sortType}&page=${(parseInt(page, 10) || 1) + 1}`} className="moreButton">
                      {AppConstants.MORE}
                    </a>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    );
  }
}

export default FeedView;
