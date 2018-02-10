// @flow

import styles from './EventDetail.css';
import React, { Component } from 'react';
import CommentView from 'app/components/Comments/CommentView';
import Icon from 'app/components/Icon';
import JoinEventForm from '../JoinEventForm';
import RegisteredSummary from '../RegisteredSummary';
import {
  AttendanceStatus,
  ModalParentComponent
} from 'app/components/UserAttendance';
import Tag from 'app/components/Tags/Tag';
import { FormatTime, FromToTime } from 'app/components/Time';
import InfoList from 'app/components/InfoList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Flex } from 'app/components/Layout';
import { EVENT_TYPE_TO_STRING, colorForEvent } from '../../utils';
import Admin from '../Admin';
import RegistrationMeta from '../RegistrationMeta';
import DisplayContent from 'app/components/DisplayContent';
import {
  Content,
  ContentHeader,
  ContentSection,
  ContentMain,
  ContentSidebar
} from 'app/components/Content';
import UserGrid from 'app/components/UserGrid';
import type { ID } from 'app/models';
import { Link } from 'react-router';

type InterestedButtonProps = {
  isInterested: boolean
};

const InterestedButton = ({ isInterested }: InterestedButtonProps) => {
  const icon = isInterested ? 'star' : 'star-outline';
  return <Icon className={styles.star} name={icon} />;
};

/**
 *
 */
type Props = {
  eventId: string,
  event: Object,
  loggedIn: boolean,
  currentUser: Object,
  actionGrant: Array<string>,
  comments: Array<Object>,
  error?: Object,
  loading: boolean,
  pools: Array<Object>,
  registrations: Array<Object>,
  currentRegistration: Object,
  waitingRegistrations: Array<Object>,
  register: (
    eventId: string,
    captchaResponse: string,
    feedback: string
  ) => Promise<*>,
  follow: (eventId: string, userId: string) => Promise<*>,
  unfollow: (eventId: string, userId: string) => Promise<*>,
  unregister: (eventId: string, registrationId: number) => Promise<*>,
  payment: (eventId: string, token: string) => Promise<*>,
  updateFeedback: (
    eventId: string,
    registrationId: number,
    feedback: string
  ) => Promise<*>,
  deleteEvent: (eventId: ID) => Promise<*>,
  updateUser: Object => void
};

/**
 *
 */
export default class EventDetail extends Component<Props> {
  handleRegistration = ({ captchaResponse, feedback, type }: Object) => {
    const {
      eventId,
      currentRegistration,
      register,
      unregister,
      updateFeedback
    } = this.props;
    switch (type) {
      case 'feedback':
        return updateFeedback(eventId, currentRegistration.id, feedback);
      case 'register':
        // Note that we do not return this promise due to custom submitting handling
        register(eventId, captchaResponse, feedback);
        return;
      case 'unregister':
        unregister(eventId, currentRegistration.id);
        return;
      default:
        return undefined;
    }
  };

  handleToken = (token: Object) => {
    this.props.payment(this.props.event.id, token.id);
  };

  render() {
    const {
      event,
      loggedIn,
      currentUser,
      updateUser,
      actionGrant,
      comments,
      error,
      loading,
      pools,
      registrations,
      currentRegistration,
      deleteEvent,
      follow,
      unfollow
    } = this.props;

    if (!event.id) {
      return null;
    }

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    const color = colorForEvent(event.eventType);
    const onRegisterClick = event.isUserFollowing
      ? () => unfollow(event.isUserFollowing.id, event.id)
      : () => follow(currentUser.id, event.id);

    const infoItems = [
      event.company && {
        key: 'Arrangerende bedrift',
        value: (
          <Link to={`/companies/${event.company.id}`}>
            {event.company.name}
          </Link>
        )
      },
      event.createdBy && {
        key: 'Forfatter',
        value: (
          <Link to={`/users/${event.createdBy.username}`}>
            {event.createdBy.fullName}
          </Link>
        )
      },
      {
        key: 'Hva',
        value: EVENT_TYPE_TO_STRING(event.eventType)
      },
      {
        key: 'Når',
        value: <FromToTime from={event.startTime} to={event.endTime} />
      },
      { key: 'Finner sted i', value: event.location },
      event.activationTime && {
        key: 'Påmelding åpner',
        value: <FormatTime time={event.activationTime} />
      },
      event.unregistrationDeadline && {
        key: 'Avregistreringsfrist',
        value: <FormatTime time={event.unregistrationDeadline} />
      }
    ];

    const paidItems = [
      { key: 'Pris', value: `${event.priceMember / 100},-` },
      event.paymentDueDate && {
        key: 'Betalingsfrist',
        value: <FormatTime time={event.paymentDueDate} />
      }
    ];

    return (
      <div>
        <Content banner={event.cover || (event.company && event.company.logo)}>
          <ContentHeader
            borderColor={color}
            onClick={onRegisterClick}
            className={styles.title}
          >
            <InterestedButton isInterested={event.isUserFollowing} />
            {event.title}
          </ContentHeader>

          <ContentSection>
            <ContentMain>
              <DisplayContent content={event.text} />
              <Flex className={styles.tagRow}>
                {event.tags.map((tag, i) => <Tag key={i} tag={tag} />)}
              </Flex>
            </ContentMain>
            <ContentSidebar>
              <InfoList items={infoItems} />
              {event.isPriced && (
                <div className={styles.paymentInfo}>
                  <strong>Dette er et betalt arrangement</strong>
                  <InfoList items={paidItems} />
                </div>
              )}

              {loggedIn && (
                <Flex column>
                  <h3>Påmeldte</h3>
                  <UserGrid
                    minRows={2}
                    maxRows={2}
                    users={registrations.slice(0, 12).map(reg => reg.user)}
                  />
                  <ModalParentComponent pools={pools} title="Påmeldte">
                    <RegisteredSummary registrations={registrations} />
                    <AttendanceStatus />
                  </ModalParentComponent>

                  <RegistrationMeta
                    registration={currentRegistration}
                    isPriced={event.isPriced}
                  />
                  <Admin
                    actionGrant={actionGrant}
                    event={event}
                    deleteEvent={deleteEvent}
                  />
                </Flex>
              )}
            </ContentSidebar>
          </ContentSection>

          {loggedIn && (
            <JoinEventForm
              event={event}
              registration={currentRegistration}
              currentUser={currentUser}
              updateUser={updateUser}
              onToken={this.handleToken}
              onSubmit={this.handleRegistration}
            />
          )}

          {event.commentTarget && (
            <CommentView
              style={{ marginTop: 20 }}
              user={currentUser}
              commentTarget={event.commentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          )}
        </Content>
      </div>
    );
  }
}
