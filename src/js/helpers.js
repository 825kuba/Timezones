'use strict';

//FORMAT NUMBER, I.E.:  46800 -> 13 (HOURS)
export const formatOffset = function (number) {
  const divide = number / 3600;
  const intPart = parseInt(divide);
  const floatPart = divide % 1;
  const minutes = 60 * floatPart;
  const sign = number >= 0 ? '+' : '';
  return `${sign}${intPart}:${minutes <= 9 ? `0` : ``}${minutes}`;
};

//TURN NUMBERS INTO DAYS OF WEEKS
export const getDayOfWeek = function (number) {
  if (number === 0) return 'Sun';
  if (number === 1) return 'Mon';
  if (number === 2) return 'Tue';
  if (number === 3) return 'Wed';
  if (number === 4) return 'Thu';
  if (number === 5) return 'Fri';
  if (number === 6) return 'Sat';
};

// SHOW ZERO BEFORE NUMBER IF IT'S LESS THAN 10
export const addZero = number => (number < 10 ? `0${number}` : `${number}`);

// FORMAT ZONE NAME - REMOVE CHARS LIKE "/" OR "_"
export const formatZoneName = function (str) {
  if (str.includes('/')) return str.replaceAll('_', ' ').replaceAll('/', ', ');
  else return str.replaceAll(', ', '/').replaceAll(' ', '_');
};

// GET CITY NAME OUT OF TIMEZONE NAME
export const getCityName = function (str) {
  const index = str.lastIndexOf('/');
  return str.slice(index + 1).replaceAll('_', ' ');
};

// CREATE LINK TO GOOGLE MAPS BASED ON INPUTED COUNTRY AND CITY NAME
export const getMapsLink = function (countryName, cityName) {
  const countryCompleted = formatCountryName(countryName);
  const cityCompleted = cityName.replaceAll(' ', '+');
  return `https://www.google.com/maps/place/${countryCompleted}+${cityCompleted}`;
};

// FORMAT COUNTRY NAME - REMOVE FORMAL NAMES OF COUNTRIES LIKE "DEMOCRATIC REPUBLIC OF"
export const formatCountryName = function (country) {
  let index;
  if (country.includes(',')) index = country.indexOf(',');
  if (country.includes('(')) index = country.indexOf('(');
  const countrySliced = country.slice(0, index);
  if (countrySliced[countrySliced.length - 1] === ' ')
    return countrySliced.slice(0, countrySliced.length - 1);
  else return countrySliced;
};
