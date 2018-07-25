// API will change
const { ipcRenderer, remote } = require('electron');

// Input array of titles and poll answers.
// Output structured info:
// {
//   course,
//   courseCode,
//   //Name of the info. (geetha lynn )
//   infoBase,
//   // pollName: state.poll,
//   columns: _columns,
//   headers,
//   rows: _rows,
// }

const apiCall = (type, data) => {
  let responseAPICall
  switch (type) {
    case 'analyze':
      // API response will save analysed data to the store.
      responseAPICall = new Promise((resolve, reject) => {
        ipcRenderer.on('analyzed', (event, props) => {
          console.log('recived analysed!!!');
          resolve(props)
        });
      })

      ipcRenderer.send('analyze', { data: data });

      return responseAPICall
      break;
    default:

  }
}

export default apiCall
