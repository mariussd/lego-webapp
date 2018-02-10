// @flow
import React from 'react';
import type { User } from 'app/models';

import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { ProfilePicture } from 'app/components/Image';
import styles from './UserGrid.css';

const UserGrid = ({
  users,
  size = 56,
  maxRows = 2,
  minRows = 0,
  padding = 3
}: {
  users: Array<User>,
  /* profile picture size */
  size?: number,
  maxRows?: number,
  minRows?: number,
  padding?: number
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${size +
        padding}px, 1fr))`,
      gridTemplateRows: size + padding,
      overflow: 'hidden',
      minHeight: minRows * size + (minRows - 1) * padding,
      maxHeight: maxRows * size + (maxRows - 1) * padding
    }}
  >
    {users.map(user => (
      <RegisteredCell className={styles.cell} key={user.id} user={user} />
    ))}
  </div>
);

export const RegisteredCell = ({ user }: { user: User }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture
        size={56}
        user={user}
        style={{ margin: '0 auto', display: 'block' }}
      />
    </Link>
  </Tooltip>
);

export default UserGrid;
