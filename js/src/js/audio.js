(function() {

  'use strict';

  const AudioPlayer = function() {
    this.initialize.apply(this, arguments);
  };

  AudioPlayer.prototype.initialize = function() {
    this.settingsData = JSON.parse(localStorage.getItem('settingsData')) || [];
    this.isSettingsOpen = true;
    this.settingsElm = document.getElementById('js-settings');
    this.settingsSelectNumElm = document.getElementById('js-selectNum');
    this.settingsSelectSpeedElm = document.getElementById('js-selectSpeed');
    this.settingsSelectAccelerationElm = document.getElementById('js-selectAcceleration');
    this.settingsSelectRepeatElm = document.getElementById('js-selectRepeat');
    this.settingsInputPathElm = document.getElementById('js-inputPath');
    this.settingsSelectDigitElm = document.getElementById('js-selectDigit');
    this.settingsInputFileName1Elm = document.getElementById('js-inputFileName1');
    this.settingsInputFileName2Elm = document.getElementById('js-inputFileName2');
    this.videoElm = document.getElementById('js-video');
    this.showElm = document.getElementById('js-show');
    this.btnElm = document.getElementById('js-btn');

    this.path = this.settingsData.path || '';
    this.digit = this.settingsData.digit || 1;
    this.fileName1 = this.settingsData.filename1 || '';
    this.fileName2 = this.settingsData.filename2 || '';
    this.num = this.settingsData.no || 1;
    this.endNum = 1000;
    this.cnt = 0;
    this.repeat = this.settingsData.repeat || 1;
    this.acceleration = this.settingsData.acceleration || 0;
    this.speedInit = this.settingsData.speed || 1;
  };

  AudioPlayer.prototype.getOption = function(aMin,aMax,aPlus) {
    let showOption = '';
    for(let cnt=aMin;cnt<=aMax;cnt+=aPlus) {
      showOption += '<option value="' + Math.round(cnt*100)/100 + '">' + Math.round(cnt*100)/100 + '</option>';
    }
    return showOption;
  };

  AudioPlayer.prototype.setOption = function() {
    this.settingsSelectNumElm.innerHTML = this.getOption(1,1050,1);
    this.settingsSelectSpeedElm.innerHTML = this.getOption(0.55,10,0.05);
    this.settingsSelectAccelerationElm.innerHTML = this.getOption(0.00,0.1,0.01);
    this.settingsSelectRepeatElm.innerHTML = this.getOption(1,300,1);
    this.settingsSelectDigitElm.innerHTML = this.getOption(1,5,1);
  };

  AudioPlayer.prototype.setValue = function() {
    this.settingsSelectNumElm.value = this.num;
    this.settingsSelectRepeatElm.value = this.repeat;
    this.settingsSelectSpeedElm.value = this.speedInit;
    this.settingsSelectAccelerationElm.value = this.acceleration;
    this.settingsInputPathElm.value = this.path;
    this.settingsSelectDigitElm.value = this.digit;
    this.settingsInputFileName1Elm.value = this.fileName1;
    this.settingsInputFileName2Elm.value = this.fileName2;
  };

  AudioPlayer.prototype.getShowElm = function() {
    return '現在再生中の問題の番号：' + this.num + '<br>残り：' + (this.repeat-this.cnt) + '/' + this.repeat + '回<br>スピード：' + this.speed + '秒<br>加速：' + this.acceleration + '秒';
  };

  AudioPlayer.prototype.saveSettings = function(aNum, aRepeat, aSpeedInit, aAcceleration, aPath, aDigit, aFileName1, aFileName2) {
    let data = { no:aNum, repeat:aRepeat, speed:aSpeedInit, acceleration: aAcceleration, path:aPath, digit: aDigit, filename1:aFileName1, filename2:aFileName2};
    localStorage.setItem('settingsData', JSON.stringify(data));
  }

  AudioPlayer.prototype.setNum = function(e) {
    if(this.isSettingsOpen) {//set Settings
      this.num = this.settingsSelectNumElm.value;
      this.repeat = this.settingsSelectRepeatElm.value;
      this.speedInit = parseFloat(this.settingsSelectSpeedElm.value);
      this.speed = this.speedInit;
      this.acceleration = parseFloat(this.settingsSelectAccelerationElm.value);
      this.path = this.settingsInputPathElm.value;
      this.digit = parseFloat(this.settingsSelectDigitElm.value);
      this.fileName1 = this.settingsInputFileName1Elm.value;
      this.fileName2 = this.settingsInputFileName2Elm.value;
  
      this.saveSettings(this.num, this.repeat, this.speedInit, this.acceleration,this.path, this.digit, this.fileName1, this.fileName2);

      this.settingsElm.classList.add('disp--none');
      this.btnElm.innerHTML = '設定を表示する'
      this.isSettingsOpen = !this.isSettingsOpen;
      this.showElm.innerHTML = this.getShowElm();

      this.videoElm.parentNode.className = '';
      this.setPath();
      this.videoElm.load();
      this.videoPlayRateControllerSet();
    }
    else {//prepare Settings
      this.settingsElm.classList.remove('disp--none');
      this.btnElm.innerHTML = '設定して再生する' 
      this.isSettingsOpen = !this.isSettingsOpen;
    }
  };

  AudioPlayer.prototype.setPath = function() {
    let digitZero = '';
    for(let cnt=0;cnt<this.digit;++cnt) {
      digitZero += '0';
    }
    let serialNumber = (digitZero + this.num).slice(-this.digit);
    let path = this.path + this.fileName1 + serialNumber + this.fileName2 + '.mp3';
    this.videoElm.innerHTML = '<source src="' + path + '" type="video/mp4">';
  };

  AudioPlayer.prototype.videoPlayRateControllerSet = function() {
    this.videoElm.addEventListener('loadeddata', this.videoPlayRateController1.bind(this));
    this.videoElm.addEventListener('ended', this.videoPlayRateController.bind(this));
  };

  AudioPlayer.prototype.videoPlayRateController1 = function() {
    this.videoElm.playbackRate = this.speed;
  };

  AudioPlayer.prototype.videoPlayRateController = function() {
    if(this.num>=this.endNum) {
      videoElm.pause();
    }
    else {
      console.log(this.speed);  
      if(this.cnt>=this.repeat-1) {
        ++this.num;
        this.speed = this.speedInit;
        this.setPath();
        this.cnt = 0;
      }
      else {
        ++this.cnt;
        this.speed = this.speedInit + this.cnt*this.acceleration;
        this.videoElm.playbackRate = this.speed;
      }
      this.showElm.innerHTML = this.getShowElm();
      this.videoElm.load();
    }
  };

  AudioPlayer.prototype.setEvent = function() {
    this.setOption();
    this.setValue();
    this.btnElm.addEventListener('click', this.setNum.bind(this));
  };

  AudioPlayer.prototype.run = function() {
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let audioPlayer = new AudioPlayer();
    audioPlayer.run();
  });

}());