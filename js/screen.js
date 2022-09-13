'use strict'

const game = {
    title: 'Sneaky Snake',
    gameBoardDom: document.getElementById('gameboard'),
    updatePlayerNameDom: function(playerName = '') {
        console.log(playerName);
        document.getElementById('player-board').firstElementChild.textContent = playerName;
    },
  currentScreen: 'splash',
  activeModal: null,
  container: $('#container'),
  switchScreen(screenId) {
    this.currentScreen = screenId;
    if (screenId === 'splash') {
      $('nav .quit').hide();
      $('nav .help').show();
    } else if (screenId === 'game') {
      $('nav .quit').show();
      $('nav .help').show();
    } $('.screen').hide();
      $(`#${screenId}`).show();
  },

  showModal() {
    if (game.currentScreen === 'splash') {
      game.activeModal = new bootstrap.Modal($('#setup-modal'),{
        backdrop: 'static',
        keyboard: false,
      });
    } else if (game.currentScreen === 'game') {
      game.activeModal = new bootstrap.Modal($('#gameplay-modal'),{
        backdrop: 'static',
        keyboard: false,
      });
    }
    game.activeModal.show();
  },

  
  init() {
    $('header h1').html(this.title);
    $('body').show();
    $('button.quit, .no').on('click',() => {
      clickSound.play();
      clearScreen();
      clearSnakeBody();
      $('.game-over').hide();
      game.switchScreen('splash');
      // game.updatePlayerNameDom("Player Name");
      document.getElementById('player-0-name-input').value="";
    });

    $('button.play-game').on('click',() => {
      
      if(document.getElementById('player-0-name-input').value === ''){
        alert("Please Enter Name");
        game.switchScreen('splash');
        // game.updatePlayerNameDom("Player Name");
      }else{
      clickSound.play();
      game.switchScreen('game');
      }
    });
    $('button.music').on('click',() => {
      togglePlay();
    });
    $('button.help').on('click',() => {
      clickSound.play();
      game.showModal();
      clearTimeout(timer);
    });
    $('.close-modal').on('click', event => {
      game.activeModal.hide();
      game.activeModal = null;
      if (game.currentScreen === 'game' && isRunning == true) {
        drawGame();
      }
    });
    
  },
};

const player = {
    name: '',
    playerBoardDom: document.getElementById('player-board'),
    updatePlayerName: function (playerName = 'player 1') {
        player.name  = playerName;
        game.updatePlayerNameDom("Player: " + this.name);
        
    },
};


document.getElementById('player-0-join').addEventListener('click',function(){
    const playerName = document.getElementById('player-0-name-input').value;
    player.updatePlayerName(playerName);
    
});

$(game.init());
