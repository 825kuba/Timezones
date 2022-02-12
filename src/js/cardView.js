'use strict';
import {
  formatOffset,
  getDayOfWeek,
  addZero,
  getCityName,
  getMapsLink,
  formatCountryName,
} from './helpers.js';

const cards = document.querySelector('.cards');

// CLASS USED FOR CARDS
export class CardView {
  // USED TO STORE THE ADD BUTTON ELEMENT WHEN IT'S CREATED
  addBtn;

  constructor(countryName, zoneName, formatted, gmtOffset, abbreviation) {
    this.countryName = formatCountryName(countryName);
    this.zoneName = zoneName;
    this.formatted = formatted.replaceAll('-', '/'); //local time
    this.gmtOffset = gmtOffset;
    this.abbreviation = abbreviation;

    //RANDOM NUMBER USED AS ID
    this.id = Math.round(Math.random() * Date.now());

    // ALL NECESSARY TIME AND DATE VALUES
    this.hours = new Date(this.formatted).getHours();
    this.minutes = new Date(this.formatted).getMinutes();
    this.seconds = new Date(this.formatted).getSeconds();
    this.day = getDayOfWeek(new Date(this.formatted).getDay());
  }

  // MAIN FUNCTION TO DISPLAY CARD
  renderCard(model) {
    const cityName = getCityName(this.zoneName);
    // MARKUP FOR CARD
    cards.insertAdjacentHTML(
      'beforeend',
      `
      <div class="card" data-id="${this.id}">
        
        <h2 class="card__name">
          <span class="card__add">
            ${
              model.state.cards.some(card => card.zoneName === this.zoneName)
                ? '<i class="fas fa-star" title="Remove from favourites"></i>'
                : '<i class="far fa-star" title="Add to favourites"></i>'
            }
          </span>
          ${this.countryName}, <a href="${getMapsLink(
        this.countryName,
        cityName
      )}" target="_blank">${cityName}</a>
        </h2>

        <h3 class="card__offset">UTC ${formatOffset(this.gmtOffset)}</h3>
        
        <div class="clock">
          <div class="clock__center"></div>
          
          <div class="clock__hand clock__hand--hours"></div>
          <div class="clock__hand clock__hand--minutes"></div>
          <div class="clock__hand clock__hand--seconds"></div>

          <div class="clock__number clock__number--1">
            <div class="clock__digit">1</div>
          </div>
          <div class="clock__number clock__number--2">
            <div class="clock__digit">2</div>
          </div>
          <div class="clock__number clock__number--3">
            <div class="clock__digit">3</div>
          </div>
          <div class="clock__number clock__number--4">
            <div class="clock__digit">4</div>
          </div>
          <div class="clock__number clock__number--5">
            <div class="clock__digit">5</div>
          </div>
          <div class="clock__number clock__number--6">
            <div class="clock__digit">6</div>
          </div>
          <div class="clock__number clock__number--7">
            <div class="clock__digit">7</div>
          </div>
          <div class="clock__number clock__number--8">
            <div class="clock__digit">8</div>
          </div>
          <div class="clock__number clock__number--9">
            <div class="clock__digit">9</div>
          </div>
          <div class="clock__number clock__number--10">
            <div class="clock__digit">10</div>
          </div>
          <div class="clock__number clock__number--11">
            <div class="clock__digit">11</div>
          </div>
          <div class="clock__number clock__number--12">
            <div class="clock__digit">12</div>
          </div>
          </div>

         <div>
         <h2 class="card__time">${this.day} ${addZero(this.hours)}:${addZero(
        this.minutes
      )}:${addZero(this.seconds)}</h2>
               <a class="card__abbr" href="https://www.timeanddate.com/time/zones/${this.abbreviation.toLowerCase()}" target="_blank">${
        this.abbreviation
      }</a>
        </div>
      </div>
      `
    );

    // SET THE ADD BUTTON ELEMENT
    this.addBtn = document
      .querySelector(`[data-id='${this.id}']`)
      .querySelector('.card__add');

    //SELECT THE CLOCK NUMBERS ELEMENTS
    const clockNumbers = Array.from(
      document.querySelectorAll('.clock__number')
    );
    clockNumbers.forEach((n, i) => {
      // ROTATE NUMBERS AROUND CLOCK
      n.style.transform = `rotate(${30 * (i + 1)}deg)`;
      //SELECT THE DIGIT ELEMENT AND ROTATE IT SO IT SITS HORIZONTALY
      const digit = n.querySelector('.clock__digit');
      digit.style.transform = `rotate(${-30 * (i + 1)}deg)`;
    });
    // MOVE HANDS SO THEY SHOW CORRECT TIME
    this.updateClock();
  }

  // UPDATE TIME ALGORYTHM
  updateTime() {
    this.seconds++;
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes === 60) {
        this.minutes = 0;
        this.hours++;
        if (this.hours === 24) this.hours = 0;
      }
    }
  }

  // UPDATE TIME IN THE TEXT
  updateTimeText() {
    const cardTime = document
      .querySelector(`[data-id='${this.id}']`)
      .querySelector('.card__time');

    cardTime.innerHTML = `${this.day} 
  ${addZero(this.hours)}:${addZero(this.minutes)}:${addZero(this.seconds)}
  `;
  }

  //UPDATE TIME ON CLOCK
  updateClock() {
    // CALCULATE RATIO FOR HANDS
    const secondsRatio = this.seconds / 60;
    const minutesRatio = (secondsRatio + this.minutes) / 60;
    const hoursRatio = (minutesRatio + this.hours) / 12;
    // SELECT HANDS ELEMENTS
    const secondsHand = document
      .querySelector(`[data-id='${this.id}']`)
      .querySelector('.clock__hand--seconds');
    const minutesHand = document
      .querySelector(`[data-id='${this.id}']`)
      .querySelector('.clock__hand--minutes');
    const hoursHand = document
      .querySelector(`[data-id='${this.id}']`)
      .querySelector('.clock__hand--hours');
    // FUNCTION FOR UPDATE HANDS POSITION
    function updateHands(hand, ratio) {
      hand.style.setProperty('--rotation', ratio * 360);
    }
    //UPDATE HANDS
    updateHands(secondsHand, secondsRatio);
    updateHands(minutesHand, minutesRatio);
    updateHands(hoursHand, hoursRatio);
  }

  startInterval() {
    //REPEAT EVERY 1 SECOND:
    setInterval(() => {
      this.updateTime();
      this.updateTimeText();
      this.updateClock();
    }, 1000);
  }

  // ADD HANDLER TO ADD BUTTON
  addHandlerAddCard(handler) {
    const t = this;
    this.addBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handler(t);
    });
  }

  // DISPLAY "ADD" STATE OF BUTTON
  addBtnDisplayAdd() {
    this.addBtn.innerHTML = '<i class="far fa-star"></i>';
  }

  // DISPLAY 'REMOVE' STATE OF BUTTON
  addBtnDisplayRemove() {
    this.addBtn.innerHTML = '<i class="fas fa-star"></i>';
  }
}
