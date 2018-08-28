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
     let element = columns[column]
     let desc = element.description
     let header = '';
     const columnData = data.map(e => e[column]).slice(1)

     // Summarize the titles. From long to short titles.
     if (desc == 'Teaching staff explained things well') {
       header = 'Staff explained well'
     } else if (desc == 'The course was intellectually stimulating') {
       header = 'Stimulating'
     } else if (desc == 'I am satisfied with the overall quality of the course') {
       header = 'Overall quality'
     } else if (desc == 'What was good about the course?') {
       header = 'What was good?'
       type = 'text'
     } else if (desc == 'How could this course be improved?') {
       header = 'How to improve?'
       type = 'text'
     } else if (desc == 'I understood what is expected of me in this course') {
       header = 'Understood what expected'
     } else if (desc == 'The course met my expectations') {
       header = 'Course met expectations'
     } else if (desc == 'The criteria used in marking have been made clear in advance') {
       header = 'Criteria clear'
     } else if (desc == 'I would recommend this course to other students') {
       header = 'Would recommend'
     } else if (desc == 'The tutorials helped me gain deeper understanding of the subject') {
       header = 'Tutorials helped'
     } else if (desc == 'I give consent') {
       header = 'Consent'
     } else {
       header = desc
       // Check type!
       // Mean of column data length. If 1 or less is 'numeric' else 'text'
       type = (columnData.reduce((t, e) => t + e.length, 0) / columnData.length) <= 1
         ? 'numeric'
         : 'text'
     }

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
