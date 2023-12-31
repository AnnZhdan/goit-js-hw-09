import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';

document.body.style.backgroundColor = '#ece5da';
const TIMER_DELAY = 1000;
let intervalId = null;
let selectedDate = null;
let currentDate = null;

const refs = {
  dateInput: document.querySelector('input#datetime-picker'),
  btnStartTimer: document.querySelector('button[data-start-timer]'),
  daysRemaining: document.querySelector('[data-days]'),
  hoursRemaining: document.querySelector('[data-hours]'),
  minutesRemaining: document.querySelector('[data-minutes]'),
  secondsRemaining: document.querySelector('[data-seconds]'),
};

refs.btnStartTimer.disabled = true;
refs.btnStartTimer.addEventListener('click', timerStart);

let remainingTime = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    onDateCheck(selectedDates);
  },
};

flatpickr(refs.dateInput, options);

Report.info(
  '👋 Greeting, my Friend!',
  'Please, choose a date and click on start',
  'Okay'
);

function onDateCheck(selectedDates) {
  selectedDate = selectedDates[0].getTime();
  currentDate = new Date().getTime();

  if (selectedDate > currentDate) {
    refs.btnStartTimer.disabled = false;
    Report.success(
      'Congratulation! Click on start!',
      'Okay'
    );
    return;
  }
  Report.failure(
    '🥺 Ooops...',
    'Please, choose a date in the future',
    'Okay'
  );
}

function timerStart() {
  intervalId = setInterval(() => {
    currentDate = new Date().getTime();
    if (selectedDate - currentDate <= 1000) {
      clearInterval(intervalId);
      refs.btnStartTimer.disabled = true;
      refs.dateInput.disabled = false;
      Report.info(
        'Congratulation! Timer stopped!',
        'Please, if you want to start timer, choose a date and click on start or reload this page',
        'Okay'
      );
      return;
    } else {
      refs.btnStartTimer.disabled = true;
      refs.dateInput.disabled = true;
      currentDate += 1000;
      remainingTime = Math.floor(selectedDate - currentDate);
      convertMs(remainingTime);
    }
  }, TIMER_DELAY);
}

function createMarkup({ days, hours, minutes, seconds }) {
  refs.daysRemaining.textContent = days;
  refs.hoursRemaining.textContent = hours;
  refs.minutesRemaining.textContent = minutes;
  refs.secondsRemaining.textContent = seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  createMarkup({ days, hours, minutes, seconds });
  return { days, hours, minutes, seconds };
}