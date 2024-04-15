(function() {

  'use strict';

  const AudioPlayer = function() {
    this.initialize.apply(this, arguments);
  };

  AudioPlayer.prototype.initialize = function() {
    this.settingsData = JSON.parse(localStorage.getItem('settingsData')) || [];
    this.isSettingsOpen = true;
    this.settingsElm = document.querySelector('.js-settings');
    this.settingsRadioElm = this.settingsElm.querySelectorAll('input[type="radio"]');
    this.settingsShowInputRadioElm = this.settingsElm.querySelectorAll('.js-showInputRadio');

    this.settingsSelectElm = this.settingsElm.querySelectorAll('select');
    this.settingsSelectNumElm = this.settingsSelectElm[0];
    this.settingsSelectRepeatElm = this.settingsSelectElm[1];
    this.settingsSelectSpeedElm = this.settingsSelectElm[2];
    this.settingsSelectAccelerationElm = this.settingsSelectElm[3];
    this.settingsSelectDigitElm = this.settingsSelectElm[4];

    this.settingsTextElm = this.settingsElm.querySelectorAll('input[type="text"]');
    this.settingsInputNumElm = this.settingsTextElm[0];
    this.settingsInputPathElm = this.settingsTextElm[1];
    this.settingsInputFileName1Elm = this.settingsTextElm[2];
    this.settingsInputFileName2Elm = this.settingsTextElm[3];

    this.showElm = document.querySelector('.js-show');
    this.videoElm = document.querySelector('.js-video');
    this.btnElm = document.querySelector('.js-btn');
    this.showNumElm = this.settingsInputFileName1Elm.nextSibling;

    this.path = this.settingsData.path || '';
    this.digit = this.settingsData.digit || 1;
    this.fileName1 = this.settingsData.filename1 || '';
    this.fileName2 = this.settingsData.filename2 || '';
    this.num = this.settingsData.no || 1;
    this.numArray = this.settingsData.array || 1;
    this.numType = this.settingsData.type || 1;
    this.endNum = 1000;
    this.cnt = 0;
    this.arrayIndex = 0;
    this.repeat = this.settingsData.repeat || 1;
    this.acceleration = this.settingsData.acceleration || 0;
    this.speedInit = this.settingsData.speed || 1;
    this.showNumElm.innerHTML = this.num;
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
    this.settingsInputNumElm.value = this.numArray;
    this.settingsInputPathElm.value = this.path;
    this.settingsSelectDigitElm.value = this.digit;
    this.settingsInputFileName1Elm.value = this.fileName1;
    this.settingsInputFileName2Elm.value = this.fileName2;

    this.setDisplayNone();
  };

  AudioPlayer.prototype.setDisplayNone = function() {
    let indexArray = (this.numType===1) ? [0,1] : [1,0];
    this.settingsRadioElm[indexArray[0]].checked = true;
    this.settingsRadioElm[indexArray[1]].checked = false;
    this.settingsShowInputRadioElm[indexArray[0]].classList.remove('disp--none');
    this.settingsShowInputRadioElm[indexArray[1]].classList.add('disp--none');
  };

  AudioPlayer.prototype.selectType = function(aCnt) {
    this.numType = aCnt+1;
    this.setDisplayNone();
  };

  AudioPlayer.prototype.getShowElm = function(aNum) {
    return '現在再生中の問題の番号：' + aNum + '<br>残り：' + (this.repeat-this.cnt) + '/' + this.repeat + '回<br>スピード：' + this.speed + '秒<br>加速：' + this.acceleration + '秒';
  };

  AudioPlayer.prototype.saveSettings = function(aNum, aNumArray, aNumType, aRepeat, aSpeedInit, aAcceleration, aPath, aDigit, aFileName1, aFileName2) {
    let data = { no:aNum, array:aNumArray, type:aNumType, repeat:aRepeat, speed:aSpeedInit, acceleration: aAcceleration, path:aPath, digit: aDigit, filename1:aFileName1, filename2:aFileName2};
    localStorage.setItem('settingsData', JSON.stringify(data));
  };

  AudioPlayer.prototype.setShowNum = function() {
    this.digit = this.settingsSelectDigitElm.value;
    let numArray = this.settingsInputNumElm.value.split(',');
    let num = (this.numType===1) ? this.settingsSelectNumElm.value : numArray[0];
    this.showNumElm.innerHTML = this.getSerialNumber(num);
  };

  AudioPlayer.prototype.setNum = function(e) {
    if(this.isSettingsOpen) {//set Settings
      if(this.settingsRadioElm[0].checked) {
        this.num = this.settingsSelectNumElm.value;
        this.numType = 1;
      }
      else {
        this.numArray = this.settingsInputNumElm.value.split(',');
        this.numType = 2;
      }
      this.repeat = this.settingsSelectRepeatElm.value;
      this.speedInit = parseFloat(this.settingsSelectSpeedElm.value);
      this.speed = this.speedInit;
      this.acceleration = parseFloat(this.settingsSelectAccelerationElm.value);
      this.path = this.settingsInputPathElm.value;
      this.digit = parseFloat(this.settingsSelectDigitElm.value);
      this.fileName1 = this.settingsInputFileName1Elm.value;
      this.fileName2 = this.settingsInputFileName2Elm.value;
  
      this.saveSettings(this.num, this.numArray, this.numType, this.repeat, this.speedInit, this.acceleration,this.path, this.digit, this.fileName1, this.fileName2);

      this.settingsElm.classList.add('disp--none');
      this.btnElm.innerHTML = '設定を表示する'
      this.isSettingsOpen = !this.isSettingsOpen;

      this.videoElm.parentNode.className = '';
      let num = (this.numType===1) ? this.num: this.numArray[0];
      this.showElm.innerHTML = this.getShowElm(num);
      this.setPath(num);
      this.videoElm.load();
      this.videoPlayRateControllerSet();
    }
    else {//prepare Settings
      this.settingsElm.classList.remove('disp--none');
      this.btnElm.innerHTML = '設定して再生する' 
      this.isSettingsOpen = !this.isSettingsOpen;
    }
  };

  AudioPlayer.prototype.getSerialNumber = function(aNum) {
    let digitZero = '';
    for(let cnt=0;cnt<this.digit;++cnt) {
      digitZero += '0';
    }
    return (digitZero + aNum).slice(-this.digit);
  };

  AudioPlayer.prototype.setPath = function(aNum) {
    let serialNumber = this.getSerialNumber(aNum);
    let path = this.path + this.fileName1 + serialNumber + this.fileName2 + '.mp3';
    this.videoElm.innerHTML = '<source src="' + path + '" type="video/mp4">';
  };

  AudioPlayer.prototype.videoPlayRateControllerSet = function() {
    this.videoElm.addEventListener('loadeddata', this.videoPlayRateControllerFirstTime.bind(this));
    this.videoElm.addEventListener('ended', this.videoPlayRateController.bind(this));
  };

  AudioPlayer.prototype.videoPlayRateControllerFirstTime = function() {
    this.videoElm.playbackRate = this.speed;
  };

  AudioPlayer.prototype.videoPlayRateController = function() {
    if(this.numType===1) {
      if(this.num>=this.endNum) {
        videoElm.pause();
      }
      else {
        if(this.cnt>=this.repeat-1) {
          ++this.num;
          this.speed = this.speedInit;
          this.setPath(this.num);
          this.cnt = 0;
        }
        else {
          ++this.cnt;
          this.speed = this.speedInit + this.cnt*this.acceleration;
          this.videoElm.playbackRate = this.speed;
        }
        this.showElm.innerHTML = this.getShowElm(this.num);
        this.videoElm.load();
      }
    }
    else {
      if(this.arrayIndex>=(this.numArray.length)) {
        videoElm.pause();
      }
      else {
        if(this.cnt>=this.repeat-1) {
          ++this.arrayIndex;
          this.speed = this.speedInit;
          this.setPath(this.numArray[this.arrayIndex]);
          this.cnt = 0;
        }
        else {
          ++this.cnt;
          this.speed = this.speedInit + this.cnt*this.acceleration;
          this.videoElm.playbackRate = this.speed;
        }
        this.showElm.innerHTML = this.getShowElm(this.numArray[this.arrayIndex]);
        this.videoElm.load();
      }
    }
  };

  AudioPlayer.prototype.setEvent = function() {
    this.setOption();
    this.setValue();
    this.settingsSelectDigitElm.addEventListener('change', this.setShowNum.bind(this));
    this.settingsSelectNumElm.addEventListener('change', this.setShowNum.bind(this));
    this.btnElm.addEventListener('click', this.setNum.bind(this));

    for(let cnt=0;cnt<2;++cnt) {
      let that = this;
      this.settingsRadioElm[cnt].addEventListener('click', function() {
        that.selectType(cnt);
        that.setShowNum();
      });
    }

    this.settingsInputNumElm.addEventListener('keyup', this.setShowNum.bind(this));
  };

  AudioPlayer.prototype.run = function() {
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let audioPlayer = new AudioPlayer();
    audioPlayer.run();
  });

}());