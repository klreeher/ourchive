/*
 *
 * Work actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_WORKS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getWorks() {
  return {
    type: LOAD_WORKS,
  };
}
