/**
 *
 * Work
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { getWorks } from '../Work/actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectWork from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';



export class Work extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.loadedWorks();
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Work</title>
          <meta name="description" content="Description of Work" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

Work.propTypes = {
  loadedWorks: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  work: makeSelectWork(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadedWorks: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(getWorks());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'work', reducer });
const withSaga = injectSaga({ key: 'work', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Work);
