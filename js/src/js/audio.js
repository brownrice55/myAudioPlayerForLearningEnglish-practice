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
    this.settingsNameAreaElm = document.querySelectorAll('.js-settingsNameArea');

    this.settingsSelectElm = this.settingsElm.querySelectorAll('select');
    this.settingsSelectNameElm = this.settingsSelectElm[0];
    this.settingsSelectNumElm = this.settingsSelectElm[1];
    this.settingsSelectRepeatElm = this.settingsSelectElm[2];
    this.settingsSelectSpeedElm = this.settingsSelectElm[3];
    this.settingsSelectAccelerationElm = this.settingsSelectElm[4];
    this.settingsSelectDigitElm = this.settingsSelectElm[5];
    this.settingsSelectTimerElm = this.settingsSelectElm[6];

    this.settingsTextElm = this.settingsElm.querySelectorAll('input[type="text"]');
    this.settingsInputNameInitialElm = this.settingsTextElm[0];
    this.settingsInputNumElm = this.settingsTextElm[1];
    this.settingsInputPathElm = this.settingsTextElm[2];
    this.settingsInputFileName1Elm = this.settingsTextElm[3];
    this.settingsInputFileName2Elm = this.settingsTextElm[4];

    this.settingsCheckboxElm = this.settingsElm.querySelectorAll('input[type="checkbox"]');
    this.option = document.querySelectorAll('.js-option');

    this.editAreaElm = document.querySelector('.js-editArea');
    this.editBtnElm = this.editAreaElm.querySelector('button');
    this.showElm = document.querySelector('.js-show');
    this.videoElm = document.querySelector('.js-video');
    this.btnElm = document.querySelector('.js-btn');
    this.saveAreaElm = document.querySelector('.js-save');
    this.saveBtnAreaDivElm = this.saveAreaElm.querySelectorAll('div');
    this.saveBtnElm = this.saveAreaElm.querySelectorAll('button');
    this.btnSaveAsElm = this.saveBtnElm[0];
    this.btnSaveElm = this.saveBtnElm[1];
    this.showNumElm = this.settingsInputFileName1Elm.nextSibling;
    this.modalElm = document.querySelectorAll('.js-modal');

    this.currentSettingsName = localStorage.getItem('currentSettingsName');
    this.setSettings();

    this.isSomethingChanged = false;
    this.isInitial = (!this.settingsData.size) ? true : false;
    this.showAndHideNameSetting();
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
    this.repetition = this.currentSettingsData.repetition || 1;
    this.acceleration = this.currentSettingsData.acceleration || 0;
    this.speedInit = this.currentSettingsData.speed || 1;
    this.showNumElm.innerHTML = this.num;
    this.timer = this.currentSettingsData.timer || 1;
    this.isCheckedIndexArray = this.currentSettingsData.isCheckedIndexArray || [false, false];
    this.endNum = 1000;
    this.cnt = 0;
    this.arrayIndex = 0;
  };

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
    this.settingsSelectTimerElm.innerHTML = this.getOption(1,20,0.5);

    let settingsNameData = '';
    if(!this.isInitial) {
      this.settingsData.forEach((value) => {
        settingsNameData += '<option value="' + value.settingsName + '">' + value.settingsName + '</option>';
      });
      this.settingsSelectNameElm.innerHTML = settingsNameData;
    }
  };

  AudioPlayer.prototype.setValue = function() {
    this.settingsSelectNameElm.value = this.currentSettingsName;
    this.settingsSelectNumElm.value = this.num;
    this.settingsSelectRepeatElm.value = this.repetition;
    this.settingsSelectSpeedElm.value = this.speedInit;
    this.settingsSelectAccelerationElm.value = this.acceleration;
    this.settingsInputNumElm.value = this.numArray;
    this.settingsInputPathElm.value = this.path;
    this.settingsSelectDigitElm.value = this.digit;
    this.settingsInputFileName1Elm.value = this.fileName1;
    this.settingsInputFileName2Elm.value = this.fileName2;
    this.settingsSelectTimerElm.value = this.timer;
    for(let cnt=0;cnt<2;++cnt) {
      this.settingsCheckboxElm[cnt].checked = this.isCheckedIndexArray[cnt];
      if(this.isCheckedIndexArray[cnt]) {
        this.option[cnt].classList.remove('disp--none');
      }
    }
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

  AudioPlayer.prototype.showAndHideNameSetting = function() {
    if(!this.isInitial) {
      this.editAreaElm.classList.remove('disp--none');
      this.settingsNameAreaElm[1].classList.add('disp--none');
      this.settingsNameAreaElm[0].classList.remove('disp--none');
      this.saveBtnAreaDivElm[0].classList.remove('disp--none');
      this.saveBtnElm[1].innerHTML = '上書き保存する';
    }
    else {
      this.editAreaElm.classList.add('disp--none'); 
      this.settingsNameAreaElm[0].classList.add('disp--none');
      this.settingsNameAreaElm[1].classList.remove('disp--none');
      this.saveBtnAreaDivElm[0].classList.add('disp--none');
      this.saveBtnElm[1].innerHTML = '設定を保存する';
    }
  };

  AudioPlayer.prototype.showAndHideOptions = function(aCnt) {
    this.isCheckedIndexArray[aCnt] = !this.isCheckedIndexArray[aCnt];
    if(this.isCheckedIndexArray[aCnt]) {
      this.option[aCnt].classList.remove('disp--none');
    }
    else {
      this.option[aCnt].classList.add('disp--none');
    }
    this.setShowNum();
  };

  AudioPlayer.prototype.changeSettings = function() {
    let name = this.settingsSelectNameElm.value;
    this.currentSettingsData = this.settingsData.get(name);
    this.setCurrentSettings(this.currentSettingsData);
  };

  AudioPlayer.prototype.getShowElm = function(aNum) {
    return '現在再生中の問題の番号：' + aNum + '<br>残り：' + (this.repetition-this.cnt) + '/' + this.repetition + '回<br>スピード：' + this.speed + '秒<br>加速：' + this.acceleration + '秒';
  };

  AudioPlayer.prototype.saveSettings = function(aSettingsName, aNum, aNumArray, aNumType, aRepeat, aSpeedInit, aAcceleration, aPath, aDigit, aFileName1, aFileName2, aSettingsData, aTimer, aIsCheckedIndexArray) {
    let data = { settingsName:aSettingsName, no:aNum, array:aNumArray, type:aNumType, repetition:aRepeat, speed:aSpeedInit, acceleration: aAcceleration, path:aPath, digit: aDigit, filename1:aFileName1, filename2:aFileName2, timer:aTimer, isCheckedIndexArray:aIsCheckedIndexArray};
    aSettingsData.set(aSettingsName, data);
    localStorage.setItem('settingsData', JSON.stringify([...aSettingsData]));
    localStorage.setItem('currentSettingsName', aSettingsName);
    let settingsNameData = '<option value="' +aSettingsName + '">' + aSettingsName + '</option>';
    this.settingsSelectNameElm.innerHTML = settingsNameData;
    this.isInitial = false;
    this.showAndHideNameSetting();
  };

  AudioPlayer.prototype.setShowNum = function() {
    let numArray = this.settingsInputNumElm.value.split(',');
    let num = (this.numType===1) ? this.settingsSelectNumElm.value : numArray[0];
    if(this.isCheckedIndexArray[0]) {//checked
      this.digit = this.settingsSelectDigitElm.value;
      this.showNumElm.innerHTML = this.getSerialNumber(num);  
    }
    else {
      this.showNumElm.innerHTML = num;
    }
  };

  AudioPlayer.prototype.getNum = function() {
      if(this.settingsRadioElm[0].checked) {
        this.num = this.settingsSelectNumElm.value;
        this.numType = 1;
      }
      else {
        this.numArray = this.settingsInputNumElm.value.split(',');
        this.numType = 2;
      }
      this.repetition = this.settingsSelectRepeatElm.value;
      this.speedInit = parseFloat(this.settingsSelectSpeedElm.value);
      this.speed = this.speedInit;
      this.acceleration = parseFloat(this.settingsSelectAccelerationElm.value);
      this.path = this.settingsInputPathElm.value;
      this.digit = parseFloat(this.settingsSelectDigitElm.value);
      this.fileName1 = this.settingsInputFileName1Elm.value;
      this.fileName2 = this.settingsInputFileName2Elm.value;
      this.currentSettingsName = (!this.isInitial) ? this.settingsSelectNameElm.value : this.settingsInputNameInitialElm.value;
      this.timer = this.settingsSelectTimerElm.value;
  };

  AudioPlayer.prototype.setNum = function(e) {
    if(this.isSettingsOpen) {//set Settings
      this.getNum();
      localStorage.setItem('currentSettingsName', this.currentSettingsName);

      this.settingsElm.classList.add('disp--none');
      this.saveAreaElm.classList.add('disp--none');
      this.btnElm.innerHTML = '設定を表示する';
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
      this.saveAreaElm.classList.remove('disp--none');
      this.btnElm.innerHTML = '上記の設定で再生する';
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
    let serialNumber = (this.isCheckedIndexArray[0]) ? this.getSerialNumber(aNum) : aNum;
    let path = this.path + this.fileName1 + serialNumber + this.fileName2 + '.mp3';
    this.videoElm.innerHTML = '<source src="' + path + '" type="video/mp4">';
  };

  AudioPlayer.prototype.closeModal = function(aElm, aIsSaved) {
    let that = this;
    aElm.addEventListener('click', function() {
      for(let cnt=0;cnt<2;++cnt) {
        that.modalElm[cnt].classList.add('disp--none');
      }
      let modalInputElm = document.querySelector('.js-modalInput');
      if(aIsSaved) {
        if(!modalInputElm.value) {
          that.modalElm[1].innerHTML = '';
          return;
        }
        that.getNum();
        let saveSettings = new Promise(function(resolve, reject) {
          that.saveSettings(modalInputElm.value, that.num, that.numArray, that.numType, that.repetition, that.speedInit, that.acceleration, that.path, that.digit, that.fileName1, that.fileName2, that.settingsData, that.timer, that.isCheckedIndexArray);
          resolve();
        });
        saveSettings.then(function(value) {
          window.location.reload(false);
        });
      }
      else if(that.isSomethingChanged) {
        window.location.reload(false);
      }
      that.modalElm[1].innerHTML = '';
    });
  };

  AudioPlayer.prototype.saveSettingsAs = function() {
    let modalCloseElm = document.querySelector('.js-modalClose');
    let modalSaveBtnElm = document.querySelector('.js-modalSaveBtn');
    this.closeModal(modalCloseElm,false);
    this.closeModal(modalSaveBtnElm,true);
  };

  AudioPlayer.prototype.deleteAndEditSettings = function() {
    let that = this;
    let editBtnElm = document.querySelectorAll('.js-editBtn');
    editBtnElm.forEach((elm, index) => {
      elm.addEventListener('click', function() {
        if(this.parentNode.previousSibling.disabled) {
          this.parentNode.previousSibling.disabled = false;
          this.innerHTML = '保存';
        }
        else {
          if(that.settingsData.has(this.value)) {//same name
            return;
          }
          let name = this.dataset.name;
          let selectedData = that.settingsData.get(name);
          let newName = this.parentNode.previousSibling.value;
          localStorage.setItem('currentSettingsName', newName);
          this.parentNode.previousSibling.disabled = true;
          this.innerHTML = '編集';
          that.settingsData.delete(name);
          let data = { settingsName:newName, no:selectedData.num, array:selectedData.numArray, type:selectedData.numType, repetition:selectedData.repetition, speed:selectedData.speed, acceleration: selectedData.acceleration, path:selectedData.path, digit: selectedData.digit, filename1:selectedData.fileName1, filename2:selectedData.fileName2, timer:selectedData.timer, isCheckedIndexArray:selectedData.isCheckedIndexArray};
          that.settingsData.set(newName, data);
          localStorage.setItem('settingsData', JSON.stringify([...that.settingsData]));
        }
      });
      elm.parentNode.previousSibling.addEventListener('change', function() {
        that.isSomethingChanged = !that.settingsData.has(this.value);
      });
    });

    let deleteBtnElm = document.querySelectorAll('.js-deleteBtn');
    deleteBtnElm.forEach((elm, index) => {
      elm.addEventListener('click', function() {
        let name = this.dataset.name;
        that.settingsData.delete(name);
        localStorage.setItem('settingsData', JSON.stringify([...that.settingsData]));
        this.parentNode.parentNode.remove();
        that.isSomethingChanged = true;
        if(that.settingsData.size) {
          let temporaryName = '';
          that.settingsData.forEach((value) => {
            temporaryName = value.settingsName;
            return;
          });
          localStorage.setItem('currentSettingsName', temporaryName);  
        }
        else {
          window.location.reload(false);
        }
      });
    });

    let modalCloseElm = document.querySelector('.js-modalClose');
    this.closeModal(modalCloseElm,false);

  };

  AudioPlayer.prototype.videoPlayRateControllerSet = function() {
    this.videoElm.addEventListener('loadeddata', this.videoPlayRateControllerFirstTime.bind(this));
    this.videoElm.addEventListener('ended', this.videoPlayRateController.bind(this));
  };

  AudioPlayer.prototype.videoPlayRateControllerFirstTime = function() {
    this.videoElm.playbackRate = this.speed;
  };

  AudioPlayer.prototype.setTimer = function() {
    const timer = setTimeout(() => {
      this.videoElm.load();
    }, this.timer*1000);
  };

  AudioPlayer.prototype.videoPlayRateController = function() {
    if(this.numType===1) {
      if(this.num>=this.endNum) {
        videoElm.pause();
      }
      else {
        if(this.cnt>=this.repetition-1) {
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
        if(this.isCheckedIndexArray[1]) {
          this.setTimer();
        }
        else {
          this.videoElm.load();
        }
      }
    }
    else {
      if(this.arrayIndex>=(this.numArray.length)) {
        videoElm.pause();
      }
      else {
        if(this.cnt>=this.repetition-1) {
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
        if(this.isCheckedIndexArray[1]) {
          this.setTimer();
        }
        else {
          this.videoElm.load();
        }
      }
    }
  };

  AudioPlayer.prototype.setEvent = function() {
    this.setOption();
    this.setValue();
    this.setShowNum();
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
      that.getNum();
      that.saveSettings(that.currentSettingsName, that.num, that.numArray, that.numType, that.repetition, that.speedInit, that.acceleration,that.path, that.digit, that.fileName1, that.fileName2, that.settingsData, that.timer, that.isCheckedIndexArray);
    });
    this.btnSaveAsElm.addEventListener('click', function() {
      that.modalElm[1].innerHTML = '<button class="js-modalClose modal__close">✖️</button><span>名前：</span> <input type="text" class="js-modalInput"><br><button class="js-modalSaveBtn modal__saveBtn">保存する</button>';
      for(let cnt=0;cnt<2;++cnt) {
        that.modalElm[cnt].classList.remove('disp--none');
      }
      that.saveSettingsAs();
    });
    this.editBtnElm.addEventListener('click', function() {
      let input = '';
      let cnt = 0;
      that.settingsData.forEach((value) => {
        input += '<li><input type="text" data-index=' + cnt + ' value="' + value.settingsName + '" disabled><div class="modal__deleteEditBtnArea"><button class="js-editBtn" data-name=' + value.settingsName + '>編集</button><button class="js-deleteBtn" data-name=' + value.settingsName + '>削除</button></div></li>';
        ++cnt;
      });
      that.modalElm[1].innerHTML = '<p>「編集」ボタンを押して編集した後に「保存」ボタンを押してください。</p><button class="js-modalClose modal__close">✖️</button><ul>' + input + '</ul>';
      for(let cnt=0;cnt<2;++cnt) {
        that.modalElm[cnt].classList.remove('disp--none');
      }
      that.deleteAndEditSettings();
    });
    for(let cnt=0;cnt<2;++cnt) {
      this.settingsCheckboxElm[cnt].addEventListener('click', function() {
        that.showAndHideOptions(cnt);
      });
    }
  };

  AudioPlayer.prototype.run = function() {
    this.setEvent();
  };

  window.addEventListener('DOMContentLoaded', function() {
    let audioPlayer = new AudioPlayer();
    audioPlayer.run();
  });

}());