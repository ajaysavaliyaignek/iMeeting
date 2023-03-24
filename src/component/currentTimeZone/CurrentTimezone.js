var offset = new Date().getTimezoneOffset();
if (offset < 0) {
  var extraZero = '';
  if (-offset % 60 < 10) extraZero = '0';
} else {
  var extraZero = '';
  if (offset % 60 < 10) extraZero = '0';
}

export const currentTimeZone =
  offset < 0
    ? `GMT+${
        (offset / -60).toString().split('.')[0] +
        ':' +
        extraZero +
        (-offset % 60)
      }`
    : `GMT-${
        (offset / 60).toString().split('.')[0] + ':' + extraZero + (offset % 60)
      }`;
