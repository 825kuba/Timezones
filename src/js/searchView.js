'use strict';

import {
  formatOffset,
  formatZoneName,
  getCityName,
  formatCountryName,
} from './helpers.js';

const searchList = document.querySelector('#locations');
const searchForm = document.querySelector('.search-bar__location input');
const searchBar = document.querySelector('.search-bar');
const positionBtn = document.querySelector('.search-bar__btn--location');

//ADD HANDLER FOR FOCUSING THE SEARCH FORM (GETTING THE LIST OF TIMEZONES)
export const addHandlerSearchList = function (handler) {
  searchForm.addEventListener('focus', function (e) {
    e.preventDefault();
    handler();
  });
};

// ADD HANDLER FOR SUBMITING THE SEARCH FORM
export const addHandlerSearch = function (handler) {
  searchBar.addEventListener('submit', function (e) {
    e.preventDefault();
    if (searchForm.value === '') return;
    handler();
  });
};

// ADD HANDLER FOR CLICKING THE POSITION BUTTON
export const addHandlerPosition = function (handler) {
  positionBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handler();
  });
};

//RENDERING THE LIST OF TIMEZONES INTO THE FORM
export const populateSearchList = function (data) {
  searchList.innerHTML = '';
  //SORT ZONES BY COUNTRY NAME
  const zonesSorted = data.sort((a, b) =>
    formatCountryName(a.countryName).localeCompare(
      formatCountryName(b.countryName)
    )
  );
  zonesSorted.forEach(loc => {
    //EDIT STRINGS TO LOOK MORE READABLE
    const str = formatZoneName(loc.zoneName);
    //FILL IN THE DATALIST
    searchList.insertAdjacentHTML(
      'beforeend',
      `
       <option value="${formatCountryName(loc.countryName)} - ${getCityName(
        loc.zoneName
      )} (UTC ${formatOffset(loc.gmtOffset)})">${str}</option>

      `
    );
  });
};

// GET THE SEARCH PHRASE
export const getSearchPhrase = function () {
  const value = searchForm.value;
  const label = searchList.querySelector(`option[value="${value}"]`).label;
  const searchPhrase = formatZoneName(label);
  searchForm.value = '';
  return searchPhrase;
};
