

const filterData = (filterOptions, data) => {
  let filteredData
  let rowsIndex = []
  // Example filter array
  // const fil = [
  //   // {
  //   //   id: 0,
  //   //   type: 'numeric',
  //   //   filter: [0, 1, 5]
  //   // },
  //   // {
  //   //   id: 1,
  //   //   type: 'numeric',
  //   //   filter: [2, 3, 4]
  //   // },
  //   {
  //     id: 3,
  //     filter: ['course', 'exam'],
  //     type: "string"
  //   }
  // ]

  // Skip the first and second columns and the first row.

  filteredData = data.slice(1).reduce((result, row, i) => {
    let rowSkipTwoColumns = row.slice(2)

    for (let filterId in filterOptions) {
      let filter = filterOptions[filterId]
      if (filter.type == 'numeric') {
        if (
          filter.filter.includes(
            parseInt(rowSkipTwoColumns[filter.id]) ) == false
        ) {
          return result
        }
      } else {
        // If Type is string
        for (let word of filter.filter) {
          if (
            rowSkipTwoColumns[filter.id].includes(word) == false
          ) {
            return result
          }
        }
      }
    }
    rowsIndex.push(i)
    result.push(row)
    return result
  }, [])
  // Add titles
  filteredData.unshift(data[0])

  return {
    data: filteredData,
    index: rowsIndex,
  }
}

export default filterData
