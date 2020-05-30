import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: {
    school,
    degree,
    fieldofstudy,
    location,
    current,
    to,
    from,
    description,
  },
}) => {
  return (
    <div>
      <h3 className='text-dark'>{school}</h3>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -
      {!to ? ' Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field of Study: </strong>
        {fieldofstudy}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
