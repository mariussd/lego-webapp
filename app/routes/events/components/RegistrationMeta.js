// @flow

import React from 'react';
import { hasPaid } from '../utils';

type Props = {
  registration: Object,
  isPriced: boolean
};

const RegistrationMeta = ({ registration, isPriced }: Props) => (
  <div>
    {!registration && (
      <div>
        <i className="fa fa-exclamation-circle" /> Du er ikke registrert
      </div>
    )}
    {registration && (
      <div>
        {registration.pool ? (
          <div>
            <i className="fa fa-check-circle" /> Du er registrert
          </div>
        ) : (
          <div>
            <i className="fa fa-pause-circle" /> Du er i venteliste
          </div>
        )}
        {isPriced &&
          (hasPaid(registration.chargeStatus) ? (
            <div>
              <i className="fa fa-check-circle" /> Du har betalt
            </div>
          ) : (
            <div>
              <i className="fa fa-exclamation-circle" /> Du har ikke betalt
            </div>
          ))}
      </div>
    )}
  </div>
);

export default RegistrationMeta;
