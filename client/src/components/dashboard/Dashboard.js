import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentUserProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardAction from './DashboardAction';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
  getCurrentUserProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentUserProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' />
        Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardAction />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentUserProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentUserProfile })(Dashboard);
