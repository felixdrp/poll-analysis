import loadCSVFile from './CSVFileParse';
import formAnalysis from 'form-analysis';

const fileToRender = async filename => {
  let data = await loadCSVFile(filename)
  let analysed = formAnalysis(data)
  return {
    payload: {
      data,
      analysed,
    }
  }
}

export default fileToRender
