'use strict';

import * as model from './model.js';
import { CardView } from './cardView.js';
import * as searchView from './searchView.js';
import * as view from './view.js';

//CONTROL SEARCH BAR AND THE LIST OF TIMEZONES
const controlSearchList = async function () {
  try {
    // IF THERE IS ALREADY DATA, LOAD IT INTO THE FORM
    if (model.state.timeZones.length > 0) {
      searchView.populateSearchList(model.state.timeZones);
      return;
    }
    //ELSE SHOW SPINNER
    document.querySelector('.search-bar__spinner').classList.remove('hidden');
    //GET LIST OF TIMEZONES FROM API
    const data = await model.getAllTimeZones();
    //LOAD IT INTO THE FORM
    searchView.populateSearchList(data.zones);
    //SAVE THE STATE
    model.state.timeZones = data.zones;
    model.saveState();
    //HIDE SPINNER
    document.querySelector('.search-bar__spinner').classList.add('hidden');
  } catch (err) {
    view.renderError(err);
  }
};

// CONTROL GETTING DATA BASED ON SEARCH QUERY
const controlSearch = async function () {
  try {
    //DELETE CARDS CURRENTLY BEING DISPLAYED
    view.clearView();
    //SHOW SPINNER
    view.showSpinner();
    //GET SEARCH QUERY
    const query = searchView.getSearchPhrase();
    // MAKE API CALL FOR QUERY
    const data = await model.getDataBySearch(query);
    //HIDE SPINNER
    view.hideSpinner();
    //CREATE NEW CARD WITH DATA FROM API
    model.newCard(data, CardView, 'search');
    cardInit(model.state.searchCard);
  } catch (err) {
    view.renderError(err);
  }
};

// CONTROL GETTING DATA BASED ON GEOLOCATION
const controlTimeZoneByPosition = async function () {
  try {
    //DELETE CARDS CURRENTLY BEING DISPLAYED
    view.clearView();
    //SHOW SPINNER
    view.showSpinner();
    // GET USER'S POSITION
    const position = await model.getUsersPosition();
    //GET DATA FOR USER'S TIMEZONE
    const data = await model.getDataByPosition(
      position.coords.latitude,
      position.coords.longitude
    );
    //HIDE SPINNER
    view.hideSpinner();
    model.newCard(data, CardView, 'position');
    cardInit(model.state.positionCard);
  } catch (err) {
    view.renderError(err);
  }
};

// CONTROL ADDING CARDS TO "MY PLACES"
const controlAddCard = function (card) {
  // IF THERE IS CARD IN STATE THAT MATCHES THE CLICKED CARD'S ZONE NAME
  if (model.state.cards.some(c => c.zoneName === card.zoneName)) {
    //FIND INDEX OF THAT CARD AND DELETE IT FROM STATE
    const carIndex = model.state.cards.findIndex(
      c => c.zoneName === card.zoneName
    );
    model.state.cards.splice(carIndex, 1);
    //DISPLAY ADD BUTTON ON CARD
    card.addBtnDisplayAdd();
  } else {
    //IF THERE IS ALREADY 2 CARDS, SHOW INFO BOX AND RETURN
    if (model.state.cards.length >= 2) {
      view.showModal();
      return;
    }
    //ELSE CREATE NEW CARD AND PUSH IT TO THE STATE
    model.newCard(card, CardView, 'cards');
    // DISPLAY REMOVE BUTTON ON CARD
    card.addBtnDisplayRemove();
  }
  // SAVE STATE
  model.saveState();
  //UPDATE MY PLACES ICON STATE
  view.updateMyPlacesIconState(model.state.cards);
};

// CONTROL OPENING MY PLACES
const controlMyPlaces = async function () {
  try {
    // IF THERE IS NOT SAVED PLACES, RETURN
    if (!model.state.cards.length) return;
    //CLEAR VIEW AND SHOW SPINNER
    view.clearView();
    view.showSpinner();
    // CREATE EMPTY ARRAY
    const promises = [];
    // FILL THE ARRAY WITH API CALL METHOD FOR EACH CARD
    model.state.cards.forEach(card =>
      promises.push(model.getDataBySearch(card.zoneName))
    );
    // DO ALL CALLS SIMULTANEUSLY
    await Promise.all(promises).then(value => {
      // THEN EMPTY THE CARDS ARRAY IN STATE
      model.state.cards.splice(0);
      // AND FILL IT WITH UPDATES DATA
      value.forEach(card => {
        model.newCard(card, CardView, 'cards');
      });
    });
    // HIDE SPINNER AND RUN INIT FUNCTION FOR EVERY CARD
    view.hideSpinner();
    model.state.cards.forEach(card => {
      cardInit(card);
    });
  } catch (err) {
    view.renderError(err);
  }
};

// SHOW CARD, START CLOCK INTERVAL AND ADD HANDLER TO ADD/REMOVE BUTTON
const cardInit = function (card) {
  card.renderCard(model);
  card.startInterval();
  card.addHandlerAddCard(controlAddCard);
};

// BASIC INIT FUNCTION
function init() {
  model.getState();
  controlTimeZoneByPosition();
  searchView.addHandlerSearchList(controlSearchList);
  searchView.addHandlerSearch(controlSearch);
  searchView.addHandlerPosition(controlTimeZoneByPosition);
  view.addHandlerMyPlaces(controlMyPlaces);
  view.updateMyPlacesIconState(model.state.cards);
  view.addHandlerMenu(view.openCloseMenu);
}
init();
