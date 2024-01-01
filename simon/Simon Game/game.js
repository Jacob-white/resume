var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var level = 0;
var gameStarted = false;



$(document).keydown(function() {
    if (gameStarted === false) {
  
      $("#level-title").text("Level " + level);
      nextSequence();
      gameStarted = true;
    }
  });

  $(".btn").click(storeUserSelection);



function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function storeUserSelection() {
    var userSelection = $(this).attr("id");
    userClickedPattern.push(userSelection);
    $("#" + userSelection).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(userSelection);
    animatePress(userSelection);
    checkAnswer(userClickedPattern.length - 1);
}


function nextSequence() {
    level = level + 1;
    $("#level-title").text("Level " + level);
    userClickedPattern = [];

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColor);
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed")
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed")
    }, 200);
}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("Success");
        if (gamePattern.length === userClickedPattern.length) {
            setTimeout(function() {nextSequence();}, 1000);
        }
    }
    else {
        console.log("Wrong");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over")
        }, 200);
        $("#level-title").text("Game Over You Made It To Level: " + (level - 1) + " Press Any Key To Restart");
        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    gameStarted = false;
}


document.getElementById('openKeyboard').addEventListener('click', function(){
    var inputElement = document.getElementById('hiddenInput');
    inputElement.style.visibility = 'visible'; // unhide the input
    inputElement.focus(); // focus on it so keyboard pops
    inputElement.style.visibility = 'hidden'; // hide it again
});