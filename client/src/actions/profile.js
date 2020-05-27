import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR } from './types';

// Get Current User Profile
export const getCurrentUserProfile = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
