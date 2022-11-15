export const searchFilterUsers = (
  text,
  data,
  setSearchText,
  setFilterData,
  filterText
) => {
  if (text) {
    const newData = data.filter((item) => {
      const itemData = filterText ? filterText : '';
      const textData = text;
      return itemData.indexOf(textData) > -1;
    });
    setSearchText(text);
    setFilterData(newData);
  } else {
    setSearchText(text);
    setFilterData(data);
  }
};
