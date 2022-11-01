export const searchFilter = (
  text,
  title,
  data,
  setFilterData,
  setSearchText
) => {
  if (text) {
    const newData = data.filter((item) => {
      const itemData = title ? title : '';
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
