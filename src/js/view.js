'use strict';

const cards = document.querySelector('.cards');

// STOP ALL INTERVALS AND DELETE ALL MARKUP BEING DISPLAYED
export const clearView = function () {
  const dummyInterval = setInterval(function () {}, 1000);
  for (let i = 0; i <= dummyInterval; i++) window.clearInterval(i);

  cards.innerHTML = ``;
};

//SPINNER
export const showSpinner = function () {
  cards.innerHTML = '<i class="fas fa-spinner"></i>';
};

export const hideSpinner = function () {
  cards.innerHTML = '';
};

// ADD HANDLER FOR CLICKING MY PLACES BUTTON
export const addHandlerMyPlaces = function (handler) {
  const myPlacesBtn = document.querySelector('.header__link--my-places');

  myPlacesBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handler();
  });
};

// MOBILE MENU

// SELECT ELEMENTS
const navBtn = document.querySelector('.header__nav-btn');
const menu = document.querySelector('.header__links');
const overlay = document.querySelector('.overlay');
const navLinks = Array.from(document.querySelectorAll('.header__list-item'));

//ADD HANDLERS FOR OPENING/CLOSING MOBILE MENU
export const addHandlerMenu = function (handler) {
  navBtn.addEventListener('click', handler);

  navLinks.forEach(link => link.addEventListener('click', handler));

  overlay.addEventListener('click', handler);
};

// OPEN CLOSE MOBILE MENU FUNCTION
export const openCloseMenu = function () {
  menu.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
  navBtn.classList.toggle('open');
};

// DISPLAY ERROR MESSAGE WITH OPTION TO SHOW ERROR DETAILS AND RELOAD PAGE
export const renderError = function (err) {
  clearView();
  cards.innerHTML = `
  <div class="error">
    <h2 class="error__heading">
      There was a problem <i class="far fa-frown"></i>
    </h2>
    <div class="error__buttons">
      <button class="error__btn   error__btn--reload">Reload page</button>
      <button class="error__btn error__btn--show">Show  details</button>
    </div>
    <p class="error__details hidden">${err}</p>
  </div>
  `;
  // SELECT BUTTON ELEMENTS
  const btnShow = document.querySelector('.error__btn--show');
  const btnReload = document.querySelector('.error__btn--reload');
  const details = document.querySelector('.error__details');
  // SHOW ERROR DETAILS WHEN BTN CLICKED
  btnShow.addEventListener('click', () => details.classList.remove('hidden'));
  // RELOAD PAGE WHEN BUTTON CLICKED
  btnReload.addEventListener('click', () => location.reload());
};

// MODAL
// SELECT ELEMENTS
const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.modal__close');
// SHOW MODAL WHEN USER TRIES TO ADD MORE THAN 2 PLACES
export const showModal = function () {
  //IF MODAL IS ALREADY BEING DISPLAYED, RETURN
  if (!modal.classList.contains('hidden')) return;
  // SHOW MODAL
  modal.classList.remove('hidden');
  // SET TIMEOUT
  const modalTimer = setTimeout(hideModal, 5000);
  //HIDE MODAL AND STOP TIMEOUT
  function hideModal() {
    modal.classList.add('hidden');
    clearTimeout(modalTimer);
  }
  // HIDE MODAL WHEN BTN CLICKED
  btnCloseModal.addEventListener('click', () => hideModal());
};

// UPDATE MY PLACES ICON BASED ON HOW MANY PLACES ARE ADDED
export const updateMyPlacesIconState = function (cards) {
  // SELECT ELEMENTs
  const icon = document.querySelector('.header__link--my-places .fa-star');
  const badge = document.querySelector('.header__link--my-places .num-badge');
  //IF THERE IS NO PLACES ADDED, DISPLAY EMPTY STAR ICON
  if (!cards.length) {
    icon.classList.remove('fas');
    icon.classList.add('far');
    badge.classList.add('hidden');
  } else {
    // ELSE DISPLAY FILLED STAR ICON
    icon.classList.remove('far');
    icon.classList.add('fas');
    badge.classList.remove('hidden');
  }
  badge.textContent = cards.length;
};
