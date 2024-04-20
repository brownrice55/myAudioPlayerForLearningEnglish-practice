(function() {

  'use strict';

  const AudioPlayer = function() {
    this.initialize.apply(this, arguments);
  };

  AudioPlayer.prototype.initialize = function() {
    this.settingsData = new Map();
    let settingsData = localStorage.getItem('settingsData');
    if(settingsData!=='undefined') {
      const settingsDataJson = JSON.parse(settingsData);
      this.settingsData = new Map(settingsDataJson);
    }
    this.isSettingsOpen = true;
    this.settingsElm = document.querySelector('.js-settings');
    this.settingsRadioElm = this.settingsElm.querySelectorAll('input[type="radio"]');
    this.settingsShowInputRadioElm = this.settingsElm.querySelectorAll('.js-showInputRadio');

    this.settingsSelectElm = this.settingsElm.querySelectorAll('select');
    this.settingsSelectNameElm = this.settingsSelectElm[0];
    this.settingsSelectNumElm = this.settingsSelectElm[1];
    this.settingsSelectRepeatElm = this.settingsSelectElm[2];
    this.settingsSelectSpeedElm = this.settingsSelectElm[3];
    this.settingsSelectAccelerationElm = this.settingsSelectElm[4];
    this.settingsSelectDigitElm = this.settingsSelectElm[5];

    this.settingsTextElm = this.settingsElm.querySelectorAll('input[type="text"]');
    this.settingsInputNumElm = this.settingsTextElm[0];
    this.settingsInputPathElm = this.settingsTextElm[1];
    this.settingsInputFileName1Elm = this.settingsTextElm[2];
    this.settingsInputFileName2Elm = this.settingsTextElm[3];

    this.showElm = document.querySelector('.js-show');
    this.videoElm = document.querySelector('.js-video');
    this.btnElm = document.querySelector('.js-btn');
    this.btnSaveElm = document.querySelector('.js-btnSave');
    this.showNumElm = this.settingsInputFileName1Elm.nextSibling;
    this.modalElm = document.querySelectorAll('.js-modal');

    this.defaultName = '設定１';
    this.currentSettingsName = localStorage.getItem('currentSettingsName') || this.defaultName;
    this.setSettings();
  };

  AudioPlayer.prototype.setSettings = function() {
    this.currentSettingsData = this.settingsData.get(this.currentSettingsName) || '';
    this.path = this.currentSettingsData.path || '';
    this.digit = this.currentSettingsData.digit || 1;
    this.fileName1 = this.currentSettingsData.filename1 || '';
    this.fileName2 = this.currentSettingsData.filename2 || '';
    this.num = this.currentSettingsData.no || 1;
    this.numArray = this.currentSettingsData.array || 1;
    this.numType = this.currentSettingsData.type || 1;
    this.repeat = this.currentSettingsData.repetition || 1;
    this.acceleration = this.currentSettingsData.acceleration || 0;
    this.speedInit = this.currentSettingsData.speed || 1;
    this.showNumElm.innerHTML = this.num;
    this.endNum = 1000;
    this.cnt = 0;
    this.arrayIndex = 0;
  }

  AudioPlayer.prototype.setCurrentSettings = function() {
    this.currentSettingsName = this.settingsSelectNameElm.value;
    this.setSettings();
    this.setValue();
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

    let settingsNameData = '';
    if(this.settingsData.size) {
      this.settingsData.forEach((value) => {
        settingsNameData += '<option value="' + value.settingsName + '">' + value.settingsName + '</option>';
      });
    }
    else {
      settingsNameData = '<option value="' + this.defaultName + '">' + this.defaultName + '</option>';
    }
    this.settingsSelectNameElm.innerHTML = settingsNameData;
  };

  AudioPlayer.prototype.setValue = function() {
    this.settingsSelectNameElm.value = this.currentSettingsName;
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

  AudioPlayer.prototype.changeSettings = function() {
    let name = this.settingsSelectNameElm.value;
    this.currentSettingsData = this.settingsData.get(name);
    this.setCurrentSettings(this.currentSettingsData);
  };

  AudioPlayer.prototype.getShowElm = function(aNum) {
    return '現在再生中の問題の番号：' + aNum + '<br>残り：' + (this.repeat-this.cnt) + '/' + this.repeat + '回<br>スピード：' + this.speed + '秒<br>加速：' + this.acceleration + '秒';
  };

  AudioPlayer.prototype.saveSettings = function(aSettingsName, aNum, aNumArray, aNumType, aRepeat, aSpeedInit, aAcceleration, aPath, aDigit, aFileName1, aFileName2, aSettingsData) {
    let data = { settingsName:aSettingsName, no:aNum, array:aNumArray, type:aNumType, repetition:aRepeat, speed:aSpeedInit, acceleration: aAcceleration, path:aPath, digit: aDigit, filename1:aFileName1, filename2:aFileName2};
    aSettingsData.set(aSettingsName, data);
    localStorage.setItem('settingsData', JSON.stringify([...aSettingsData]));
    localStorage.setItem('currentSettingsName', aSettingsName);
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
      this.currentSettingsName = this.settingsSelectNameElm.value;

      this.saveSettings(this.currentSettingsName, this.num, this.numArray, this.numType, this.repeat, this.speedInit, this.acceleration,this.path, this.digit, this.fileName1, this.fileName2, this.settingsData);

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
      this.btnElm.innerHTML = '設定して再生する';
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

  AudioPlayer.prototype.saveSettingsAs = function() {
    let that = this;
    const closeModal = function(aElm, aIsSaved) {
      aElm.addEventListener('click', function() {
        for(let cnt=0;cnt<2;++cnt) {
          that.modalElm[cnt].classList.add('disp--none');
        }
        let modalInputElm = document.querySelector('.js-modalInput');
        if(aIsSaved) {
          if(!modalInputElm.value) {
            return;
          }
          that.saveSettings(modalInputElm.value, that.num, that.numArray, that.numType, that.repeat, that.speedInit, that.acceleration,that.path, that.digit, that.fileName1, that.fileName2, that.settingsData);
        }
      });
    };
    let modalCloseElm = document.querySelector('.js-modalClose');
    let modalSaveBtnElm = document.querySelector('.js-modalSaveBtn');
    closeModal(modalCloseElm,false);
    closeModal(modalSaveBtnElm,true);
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
    this.settingsSelectNameElm.addEventListener('change', this.changeSettings.bind(this));
    this.btnElm.addEventListener('click', this.setNum.bind(this));

    let that = this;
    for(let cnt=0;cnt<2;++cnt) {
      this.settingsRadioElm[cnt].addEventListener('click', function() {
        that.selectType(cnt);
        that.setShowNum();
      });
    }

    this.settingsInputNumElm.addEventListener('keyup', this.setShowNum.bind(this));
    this.btnSaveElm.addEventListener('click', function() {
      that.modalElm[1].innerHTML = '<button class="js-modalClose modal__close">✖️</button><span>名前：</span> <input type="text" class="js-modalInput"><br><button class="js-modalSaveBtn modal__saveBtn">保存する</button>';
      for(let cnt=0;cnt<2;++cnt) {
        that.modalElm[cnt].classList.remove('disp--none');
      }
      that.saveSettingsAs();
    });
  };

  AudioPlayer.prototype.run = function() {
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let audioPlayer = new AudioPlayer();
    audioPlayer.run();
  });

}());