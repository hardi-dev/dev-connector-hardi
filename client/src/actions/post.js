import axios from 'axios';
import { setAlert } from './alert.js';
import { GET_POSTS, POST_ERROR } from './types';

// Get Post
export const getPosts = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
