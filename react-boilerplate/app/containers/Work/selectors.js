import { createSelector } from 'reselect';

/**
 * Direct selector to the work state domain
 */
const selectWorkDomain = (state) => state.get('work');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Work
 */

const makeSelectWork = () => createSelector(
  selectWorkDomain,
  (substate) => substate.toJS()
);

export default makeSelectWork;
export {
  selectWorkDomain,
};
