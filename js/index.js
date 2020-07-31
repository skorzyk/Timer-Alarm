class Timer {
  constructor() {
    this.inputHours = null;
    this.inputMinutes = null;
    this.inputSeconds = null;
    this.buttonEdit = null;
    this.buttonPlay = null;
    this.buttonReplay = null;
    this.audio = null;
    this.buttonAlarm = null;
    this.timerInputs = null;

    this.isEdit = true;
    this.isCounting = false;
    this.iconsPath = './assets/icons/sprite.svg#';

    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.totalTime = 0;
    this.currentTime = 0;
    this.maxSeconds = 60;
    this.maxMinutes = 60;
    this.maxHours = 99;
    this.maxTime =
      this.maxHours * 3600 + (this.maxMinutes - 1) * 60 + this.maxSeconds - 1;

    this.interval = null;

    this.UISelectors = {
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      edit: '[data-edit]',
      play: '[data-play]',
      replay: '[data-replay]',
      audio: '[data-audio]',
      alarm: '[data-alarm]',
      timeInputs: '[data-timer-input]',
    };
  }

  initializeTimer() {
    this.inputHours = document.getElementById(this.UISelectors.hours);
    this.inputMinutes = document.getElementById(this.UISelectors.minutes);
    this.inputSeconds = document.getElementById(this.UISelectors.seconds);
    this.buttonEdit = document.querySelector(this.UISelectors.edit);
    this.buttonPlay = document.querySelector(this.UISelectors.play);
    this.buttonReplay = document.querySelector(this.UISelectors.replay);
    this.audio = document.querySelector(this.UISelectors.audio);
    this.buttonAlarm = document.querySelector(this.UISelectors.alarm);
    this.timerInputs = document.querySelectorAll(this.UISelectors.timeInputs);

    this.addEventListeners();
  }
  addEventListeners() {
    this.buttonEdit.addEventListener('click', this.editTime.bind(this));
    this.buttonPlay.addEventListener('click', this.switchTimer.bind(this));
    this.buttonAlarm.addEventListener('click', this.stopAlarm.bind(this));
    this.buttonReplay.addEventListener('click', this.resetTimer.bind(this));

    this.timerInputs.forEach((input) =>
      input.addEventListener(
        'keyup',
        (e) => e.keyCode === 13 && this.editTime()
      )
    );
  }
  editTime() {
    this.isEdit = !this.isEdit;

    if (this.isEdit) {
      this.isCounting = false;
      clearInterval(this.interval);
      this.buttonEdit
        .querySelector('use')
        .setAttribute('xlink:href', `${this.iconsPath}done`);
      this.buttonPlay
        .querySelector('use')
        .setAttribute('xlink:href', `${this.iconsPath}play`);
      this.timerInputs.forEach((input) => {
        input.removeAttribute('disabled');
      });
      this.buttonPlay.setAttribute('disabled', '');
      this.getTimerValues();
      this.setTimerValues();
    } else if (!this.isEdit) {
      this.buttonEdit
        .querySelector('use')
        .setAttribute('xlink:href', `${this.iconsPath}create`);
      this.timerInputs.forEach((input) => {
        input.setAttribute('disabled', '');
      });
      this.buttonPlay.removeAttribute('disabled');
      this.getTimerValues();
      this.setTimerValues();
    }
  }

  switchTimer() {
    this.isCounting = !this.isCounting;

    if (this.isCounting) {
      this.buttonPlay
        .querySelector('use')
        .setAttribute('xlink:href', `${this.iconsPath}pause`);
      this.interval = setInterval(() => this.updateTime(), 1000);
    } else if (!this.isCounting) {
      this.buttonPlay
        .querySelector('use')
        .setAttribute('xlink:href', `${this.iconsPath}play`);
      clearInterval(this.interval);
    }
  }

  getTimerValues() {
    this.hours = parseInt(this.inputHours.value, 10);
    this.minutes = parseInt(this.inputMinutes.value, 10);
    this.seconds = parseInt(this.inputSeconds.value, 10);
    this.countTotalTime();
  }

  setTimerValues() {
    const seconds = `0${this.currentTime % this.maxSeconds}`;
    const minutes = `0${Math.floor(this.currentTime / 60) % this.maxMinutes}`;
    const hours = `0${Math.floor(this.currentTime / 3600)}`;
    this.inputSeconds.value = seconds.slice(-2);
    this.inputMinutes.value = minutes.slice(-2);
    this.inputHours.value = hours.slice(-2);
  }

  countTotalTime() {
    const timeSum = this.seconds + this.minutes * 60 + this.hours * 3600;
    this.totalTime = timeSum <= this.maxTime ? timeSum : this.maxTime;

    this.currentTime = this.totalTime;
  }
  updateTime() {
    if (this.currentTime) {
      this.currentTime--;
      this.setTimerValues();
      return;
    }
    clearInterval(this.interval);
    this.audio.play();
    this.buttonAlarm.classList.remove('hide');
    this.buttonEdit.setAttribute('disabled', '');
    this.buttonPlay.setAttribute('disabled', '');
    this.buttonReplay.setAttribute('disabled', '');
  }

  stopAlarm() {
    this.audio.pause();
    this.buttonAlarm.classList.add('hide');
    this.buttonEdit.removeAttribute('disabled');
    this.buttonPlay.removeAttribute('disabled');
    this.buttonReplay.removeAttribute('disabled');
    this.switchTimer();
  }

  resetTimer() {
    this.currentTime = this.totalTime;
    this.setTimerValues();
  }
}

const timer = new Timer();
timer.initializeTimer();
