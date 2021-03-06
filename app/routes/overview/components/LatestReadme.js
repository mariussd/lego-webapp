// @flow

import React, { Component } from 'react';
import ReadmeLogo from 'app/components/ReadmeLogo';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import styles from './LatestReadme.css';

type Props = {
  expanded: boolean
};

type State = {
  expanded: boolean
};

class LatestReadme extends Component<Props, State> {
  state = {
    expanded: this.props.expanded
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.expanded !== this.state.expanded) {
      this.setState({
        expanded: nextProps.expanded || false
      });
    }
  }

  render() {
    const { expanded } = this.state;
    const toggle = () =>
      this.setState(state => ({ expanded: !state.expanded }));

    const readmes = [
      {
        year: 2018,
        issues: [1]
      },
      {
        year: 2017,
        issues: [6, 5, 4, 3, 2]
      }
    ];

    return (
      <Flex column className={styles.latestReadme}>
        <button className={styles.heading} onClick={toggle}>
          <Flex justifyContent="space-between">
            <span>
              <ReadmeLogo />-utgaver
            </span>
            <Icon
              name={expanded ? 'close' : 'arrow-down'}
              style={{ color: '#fff' }}
            />
          </Flex>
        </button>

        {expanded && (
          <Flex wrap justifyContent="space-between" style={{ paddingTop: 20 }}>
            {readmes.map(({ year, issues }) =>
              issues.map(issue => (
                <a
                  key={issue}
                  href={`https://readme.abakus.no/utgaver/${year}/${year}-0${issue}.pdf`}
                  className={styles.thumb}
                >
                  <Image
                    src={`https://readme.abakus.no/bilder/${year}/${year}-0${issue}.jpg`}
                  />
                </a>
              ))
            )}
          </Flex>
        )}
      </Flex>
    );
  }
}

export default LatestReadme;
