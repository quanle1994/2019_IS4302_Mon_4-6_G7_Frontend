const convert = number => `$ ${isNaN(number) ? '-' : parseFloat(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

export const convertDateTime = (dateValue, isDateOnly) => {
  const date = new Date(dateValue);
  date.setSeconds(0, 0);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const dateString = (new Date(date.getTime() - tzOffset)).toISOString();
  if (isDateOnly) return dateString.split('T')[0];
  const dateTime = dateString.split(':00.000Z')[0];
  const splits = dateTime.split('T');
  return `${splits[1]} ${splits[0]}`;
};

export default convert;
