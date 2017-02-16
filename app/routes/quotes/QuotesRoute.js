import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  fetchAllApproved,
  fetchAllUnapproved,
  fetchQuote,
  like,
  unlike,
  approve,
  unapprove,
  deleteQuote
} from '../../actions/QuoteActions';
import QuotePage from './components/QuotePage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  if (!params.loggedIn) {
    return Promise.resolve();
  }

  if (params.query.filter === 'unapproved') {
    return props.fetchAllUnapproved();
  }

  return props.fetchAllApproved();
}

const compareByDate = (a, b) => {
  const date1 = new Date(a.createdAt);
  const date2 = new Date(b.createdAt);
  return date2.getTime() - date1.getTime();
};

const compareByLikes = (a, b) => b.likes - a.likes;

const selectSortedQuotes = createSelector(
  state => state.quotes.byId,
  state => state.quotes.items,
  (state, props) => props.location.query || {},
  (byId, ids, query) => {
    const compare = query.sort === 'likes' ? compareByLikes : compareByDate;

    return ids
      .map(id => byId[id])
      .filter(quote => quote.approved === (query.filter !== 'unapproved'))
      .sort(compare);
  }
);

function mapStateToProps(state, props) {
  const { query } = props.location;
  return {
    quotes: selectSortedQuotes(state, props),
    query,
    sortType: query.sort === 'likes' ? 'likes' : 'date'
  };
}

const mapDispatchToProps = {
  fetchAllApproved,
  fetchAllUnapproved,
  fetchQuote,
  like,
  unlike,
  approve,
  unapprove,
  deleteQuote
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['query', 'loggedIn'], loadData)
)(QuotePage);
