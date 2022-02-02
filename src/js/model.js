'use strict';

import API_KEY from './../../api-key.js';

//VARIABLE USED FOR STORING DATA
export let state = {
  searchCard: {},
  positionCard: {},
  cards: [],
  timeZones: [],
};

//GET A LIST OF ALL TIME ZONES
export const getAllTimeZones = async function () {
  try {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/list-time-zone?key=${API_KEY}&format=json`
    );
    if (!response.ok) throw new Error(`${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

//GET USER'S POSITION
export const getUsersPosition = function () {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => reject(error.message)
      );
    }
  });
};

//GET DATA FOR TIMEZONE BASED ON USER'S POSITION
export const getDataByPosition = async function (lat, lng) {
  try {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    if (!response.ok) throw new Error(`${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

//GET DATA FOR TIMEZONE BASED ON SEARCH
export const getDataBySearch = async function (timezone) {
  try {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=zone&zone=${timezone}`
    );
    if (!response.ok) throw new Error(`${response.status}`);
    const data = await response.json();
    if (data.status === 'FAILED') throw new Error(`${data.message}`);
    return data;
  } catch (err) {
    throw err;
  }
};

//SAVE DATA TO LOCAL STORAGE
export const saveState = function () {
  localStorage.setItem('cards', JSON.stringify(state.cards));
  localStorage.setItem('timeZones', JSON.stringify(state.timeZones));
};

//GET DATA FROM LOCAL STORAGE
export const getState = function () {
  const storageCards = localStorage.getItem('cards');
  if (storageCards) state.cards = JSON.parse(storageCards);
  const storageZones = localStorage.getItem('timeZones');
  if (storageZones) state.timeZones = JSON.parse(storageZones);
};

// CREATE NEW CARD OBJECT
export const newCard = function (data, view, type) {
  const newCard = new view(
    data.countryName,
    data.zoneName,
    data.formatted,
    data.gmtOffset,
    data.abbreviation
  );
  // SCENARIO 1 - CREATE NEW POSITION CARD OBJECT IN STATE
  if (type === 'position') {
    state.positionCard = newCard;
  }
  // SCENARIO 2 - SAVE THE CARD TO CARDS ARRAY IN STATE
  if (type === 'cards') {
    state.cards.push(newCard);
  }
  //SCENARIO 3 - SAVE TO SEARCH CARD IN STATE
  if (type === 'search') {
    state.searchCard = newCard;
  }
  //THEN RENDER NEW CARD
};
