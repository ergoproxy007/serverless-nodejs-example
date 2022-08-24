module.exports = {
  filterProfiles: (records, filters) => {
    const filteredRecords = records.filter((record, index) => {
      let isValid = true;
      for (let key in filters) {
        if (filters[key].on === 'YES') {
          isValid = isValid && record[filters[key].filterColumn] === filters[key].filterValue;
        }
      }
      return isValid;
    });
    return filteredRecords;
  },
  convertToEmailList: (records, filters) => {
    const filterEmail = filters.find( filter => filter.getEmail === 'S' );
    if (filterEmail.getEmail === 'S') {
      const profiles = records.map((record) => {
        return record[filterEmail.filterColumn].toString().toLowerCase();
      });
      return { emails: profiles };
    }
    return [];
  },
  getMetadata: () => {
    const stream = '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';
    return {
      metadata: stream
    }
  }
};