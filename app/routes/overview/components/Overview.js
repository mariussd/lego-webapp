import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { Content, Flex } from 'app/components/Layout';
import LatestReadme from './LatestReadme';
import Feed from './Feed';
import CompactEvents from './CompactEvents';
import { EVENT_TYPE_TO_STRING } from 'app/routes/events/utils';
import Button from 'app/components/Button';

const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 150;
const IMAGE_HEIGHT = 192;
const IMAGE_WIDTH = 350;

function PrimaryItem({ event }) {
  return (
    <Flex column className={styles.primaryItem}>
      <h2 className="u-ui-heading">Pinned Event</h2>
      <Flex column className={styles.innerPrimaryItem}>
        <Link
          to={`/events/${event.id}`}
          style={{ height: IMAGE_HEIGHT, display: 'block' }}
        >
          <Image className={styles.image} src={event.cover} />
        </Link>
        <div className={styles.pinnedHeading}>
          <h2 className={styles.itemTitle}>
            <Link to={`/events/${event.id}`}>
              {event.title}
            </Link>
          </h2>

          <span className={styles.itemInfo}>
            {event.startTime &&
              <Time time={event.startTime} format="DD.MM HH:mm" />}
            {event.location !== '-' &&
              <span>
                <span className={styles.dot}> · </span>
                <span>{event.location}</span>
              </span>}
            {event.eventType &&
              <span>
                <span className={styles.dot}> · </span>
                <span>{EVENT_TYPE_TO_STRING(event.eventType)}</span>
              </span>}
          </span>
        </div>
      </Flex>
    </Flex>
  );
}

const OverviewItem = ({ event, showImage }) => (
  <Flex column className={styles.item}>
    <Flex row className={styles.inner}>
      <Flex column>
        {showImage &&
          <Link
            to={`/events/${event.id}`}
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              display: 'block'
            }}
          >
            <Image className={styles.image} src={event.cover} />
          </Link>}
      </Flex>
      <Flex column className={styles.innerRight}>
        <div className={styles.heading}>
          <h2 className={styles.itemTitle}>
            <Link to={`/events/${event.id}`}>
              {truncateString(event.title, TITLE_MAX_LENGTH)}
            </Link>
          </h2>

          <span className={styles.itemInfo}>
            {event.startTime &&
              <Time time={event.startTime} format="DD.MM HH:mm" />}
            {event.location !== '-' &&
              <span>
                <span className={styles.dot}> · </span>
                <span>{event.location}</span>
              </span>}
            {event.eventType &&
              <span>
                <span className={styles.dot}> · </span>
                <span>{EVENT_TYPE_TO_STRING(event.eventType)}</span>
              </span>}
          </span>
        </div>

        <p
          className={styles.itemDescription}
          style={{
            borderTop: `3px solid ${colorForEvent(event.eventType)}`
          }}
        >
          {truncateString(event.description, DESCRIPTION_MAX_LENGTH)}
        </p>
      </Flex>
    </Flex>
  </Flex>
);

export default class Overview extends Component {
  state = {
    eventsToShow: 4
  };

  increaseEventsToShow = () => {
    this.setState({ eventsToShow: this.state.eventsToShow * 2 });
  };

  render() {
    const { events } = this.props;

    if (!events.length) {
      return null;
    }

    return (
      <Content>
        <Helmet title="Hjem" />
        <Flex row style={{ justifyContent: 'space-between' }}>
          <Flex column style={{ width: '65%' }}>
            <CompactEvents events={events} />
            <PrimaryItem event={events[0]} />
          </Flex>
          <Feed />
        </Flex>
        <Flex />
        <Flex padding={10}>
          <LatestReadme />
        </Flex>
        <Flex wrap>
          {events
            .slice(1, this.state.eventsToShow)
            .map(event => (
              <OverviewItem
                key={event.id}
                event={event}
                showImage
                increaseEventsToShow={this.increaseEventsToShow}
              />
            ))}
          <Button
            style={{ width: '100%', marginTop: '10px' }}
            onClick={() =>
              this.setState({ eventsToShow: this.state.eventsToShow ** 2 })}
          >
            Vis flere arrangementer&nbsp;
            <i className="fa fa-angle-double-down " />
          </Button>
        </Flex>
      </Content>
    );
  }
}
