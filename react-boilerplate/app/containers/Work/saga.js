import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  LOAD_WORKS,
} from './constants';

export function* loadWorks() {
  // Select username from store
  //const username = yield select(makeSelectUsername());
  //const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = "blah blah blah";
    yield repos;
  } catch (err) {
    yield "nyet";
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(LOAD_WORKS, loadWorks);
}
