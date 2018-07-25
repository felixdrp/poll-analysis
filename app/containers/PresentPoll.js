import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PresentData from '../components/present-data/PresentData.js';
// import PresentSentiment from '../components/present-sentiment/PresentSentiment.js';

function mapStateToProps(state) {
  let data = state.data

  if ( data.filtered == null ) {
    return {}
  }

  data = {
    // state,
    // poll: state.poll,
    ...data.raw,
    ...data.filtered,
  }
  // debugger
  if (data.index) {
    data.headers[0].accessor = d => d['INDEX']
    // Add index
    // Equivalence declarative.
    // data.rows = data.rows.map((e, i) => ({...e, INDEX: data.index[i]}))
    for (let index in data.rows) {
      data.rows[index].INDEX = data.index[index]
    }
  }

  return data;
}

function mapDispatchToProps(dispatch) {
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(PresentData);

// Columns structure example
//
// columns={[
//   {
//     header: "Comments' words",
//     columns: [
//       {
//         header: "Words",
//         type: 'text',
//         accessor: "Object.keys"
//       },
//       {
//         header: "Frequency",
//         type: 'numeric',
//         id: "total",
//         accessor: d => d.total
//       }
//     ]
//   }
// ]}
