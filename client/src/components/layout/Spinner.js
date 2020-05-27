import React, { Fragment } from 'react';
import Spinner from './Spinner.gif';

export default () => {
  return (
    <Fragment>
      <img
        src={Spinner}
        style={{ width: '100px', margin: 'auto', display: 'block' }}
        alt='Loading...'
      />
    </Fragment>
  );
};
