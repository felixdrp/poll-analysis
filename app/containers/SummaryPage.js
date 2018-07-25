import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Summary from '../components/summary/Summary.js';

function mapStateToProps(state) {
  let data = state.data
 // debugger
  return {
    // state,
    // poll: state.poll,
    ...data.raw,
    ...data.filtered,
  };
}

function mapDispatchToProps(dispatch) {
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
