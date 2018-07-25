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

const extractInfo = (data) => {
   // Course and courseCode the first two data.
   let [course, courseCode] = data[1]
   let columns = []
   let headers = []
   let rows = []

   columns = data[0].reduce(
     (result, description, i) => {
       result.push({
         key: 'ID' + i,
         description: description.trim()
       });
       return result
     },
     []
   );

   headers = [
     {
       header: "Rows",
       type: 'numeric',
       accessor: "Object.keys"
     },
   ]
   // Removing two first columns (course, courseCode) and lastone (Consent)
   for (let column=2; column < columns.length - 1; column++) {
     let type = 'numeric'
     let desc = columns[column].description
     let header = '';

     // Summarize the titles. From long to short titles.
     (desc.includes('explained')
       && (header = 'Explained well')) ||
     (desc.includes('stimulating')
       && (header = 'Stimulating')) ||
     (desc.includes('overall quality')
       && (header = 'Overall quality')) ||
     (desc.includes('What was good')
       && (header = 'What was good?', type = 'text')) ||
     (desc.includes('course be improved')
       && (header = 'How to improve?', type = 'text')) ||
     (desc.includes('understood what is expected')
       && (header = 'Understood expected')) ||
     (desc.includes('course met my expectations')
       && (header = 'Course met expectations')) ||
     (desc.includes('The criteria used')
       && (header = 'Criteria clear')) ||
     (desc.includes('would recommend')
       && (header = 'Would recommend')) ||
     (desc.includes('tutorials helped')
       && (header = 'Tutorials helped')) ||
     (desc.includes('I give consent')
       && (header = 'Consent'))

     headers.push({
       header: header,
       title: desc,
       type,
       accessor: d => d[columns[column].key]
     })
   }

   rows = data.slice(1).map(
     fila => fila.reduce(
       (result, element, i) => {
         result['ID'+i] = element;
         return result;
       },
       {}
     )
   );

   return {
     course,
     courseCode,
     // column Id and title
     columns,
     // header (title summarized), title, var type.
     //   Removed two first columns (course, courseCode) and lastone (Consent)
     //   Added 'Row' column header at first
     headers,
     rows,
   }
}

export default extractInfo
