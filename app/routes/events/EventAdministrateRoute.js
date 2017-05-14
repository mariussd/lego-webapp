import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchAdministrate,
  adminRegister,
  unregister,
  updatePresence,
  updatePayment
} from 'app/actions/EventActions';
import EventAdministrate from './components/EventAdministrate';
import {
  selectEventById,
  selectPoolsForEvent,
  selectAllRegistrationsForEvent
} from 'app/reducers/events';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { groupBy, debounce } from 'lodash';

const mapStateToProps = (state, props) => {
  const eventId = props.params.eventId;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsForEvent(state, { eventId });
  const registrations = selectAllRegistrationsForEvent(state, { eventId });
  const grouped = groupBy(
    registrations,
    obj => (obj.unregistrationDate.isValid() ? 'unregistered' : 'registered')
  );
  const registered = (grouped['registered'] || [])
    .sort((a, b) => a.registrationDate.isAfter(b.registrationDate));
  const unregistered = (grouped['unregistered'] || [])
    .sort((a, b) => a.unregistrationDate.isAfter(b.unregistrationDate));

  return {
    eventId,
    actionGrant,
    event,
    pools,
    registered,
    unregistered,
    searching: state.search.searching,
    usersResult: selectAutocomplete(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      {
        unregister,
        adminRegister,
        updatePresence,
        updatePayment
      },
      dispatch
    ),
    onQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['users.user'])),
      30
    )
  };
};

export default compose(
  dispatched(
    ({ params: { eventId } }, dispatch) =>
      dispatch(fetchAdministrate(Number(eventId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventAdministrate);
