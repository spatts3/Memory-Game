$(document).ready(function(){
  var images = [];
  var totalPairs = 0;
  var correctGuesses = 0;
  
  // Generate image paths based on naming convention
  var basePath = "images/card_";
  var imageCount = 24; 
  for (var i = 1; i <= imageCount; i++) {
    images.push(basePath + i + ".png");
  }

  images.sort(() => Math.random() - 0.5);
  
  // Function to generate cards based on the selected number
  function generateCards(numNewCards) {
    var gameContainer = $('.game-container');
    gameContainer.empty(); // Clear existing cards
    
    totalPairs = numNewCards / 2; // Update total pairs
    
    // Take only the required number of images
    var selectedImages = images.slice(0, totalPairs);
    
    // Duplicate each image to create pairs
    var cards = selectedImages.concat(selectedImages);
    
    // Shuffle the cards
    cards.sort(() => Math.random() - 0.5);
    
    
    cards.forEach(function(image, index) {
      var card = $('<div class="card" data-id="' + index + '"></div>');
      var imgFront = $('<img class="front" src="' + image + '" alt="Card">');
      var imgBack = $('<img class="back" src="images/back.png" alt="Back of card">');
      card.append(imgFront).append(imgBack);
      gameContainer.append(card);
    });

    
    var flippedCards = [];
    var isProcessing = false;
    $('.card').click(function() {
      if (!isProcessing && flippedCards.length < 2) {
        var card = $(this);
        var imgFront = card.find('.front');
        var imgBack = card.find('.back');
    
        if (!card.hasClass('flipped') && !card.hasClass('matched')) {
          imgFront.fadeIn(500);
          imgBack.fadeOut(500);
          card.addClass('flipped');
          flippedCards.push(card);
    
          // Check for matching cards
          if (flippedCards.length === 2) {
            isProcessing = true;
            var card1 = flippedCards[0];
            var card2 = flippedCards[1];
            if (card1.find('.front').attr('src') === card2.find('.front').attr('src')) {
              setTimeout(function() {
                card1.addClass('matched').find('.front').slideUp(500);
                card2.addClass('matched').find('.front').slideUp(500);
                correctGuesses++; // Increment correct guesses
                updatePercentage(); // Update correct guess percentage
                setTimeout(function() {
                  card1.find('.front').attr('src', 'images/blank.png').fadeIn(500);
                  card2.find('.front').attr('src', 'images/blank.png').fadeIn(500);
                  isProcessing = false;
                }, 1000);
              }, 1000);
            } else {
              setTimeout(function() {
                card1.find('.front').fadeOut(500);
                card1.find('.back').fadeIn(500);
                card1.removeClass('flipped');
                card2.find('.front').fadeOut(500);
                card2.find('.back').fadeIn(500);
                card2.removeClass('flipped');
                isProcessing = false;
              }, 1000);
            }
            flippedCards = []; 
          }
        }
      }
    });
  }

  // Function to update correct guess percentage
  function updatePercentage() {
    var percentage = (correctGuesses / totalPairs) * 100;
    $('#correct').text("Correct Guesses: " + percentage.toFixed(2) + "%");
  }

  generateCards(48);

  // Save settings event listener
  $('#save_settings').click(function() {
    var numNewCards = parseInt($('#num_cards').val());
    var playerName = $('#player_name').val(); 
    $('#player').text("Player: " + playerName);
    correctGuesses = 0;
    updatePercentage(); 
    generateCards(numNewCards);
  });

  $(function() {
    $( "#tabs" ).tabs();
  });
});


