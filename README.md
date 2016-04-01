# Magic: the Gathering Deckbuilder
##### by Kenneth Black

Magic:the Gathering Deckbuilder that I built using MEAN stack. Originally just an AngularJS SPA, the huge database of cards created a problem with page load times. I decided to shift to the MEAN stack so I could make the cards and sets API endpoints using express so I can just load the cards I need at one time, with the added benefit of user authentication so users can save and load personal decks.

##### I learned

 - How to make tests for AngularJS using Jasmine and Karma
 - How to create custom API endpoints using mongoose and express
 - How to configure oAuth for GitHub
 - How to better utilize Prototypal inheritance to effectively store complex Objects in MongoDB and re-add their methods on load
 - How to use AngularJS templating to make an effective card search function.

##### Skills used 

 - MongoDB
 - AngularJS
 - Express.js
 - Node.js
 - Object-Oriented Javascript
 - jQuery
 - RESTful APIs
 - HTML5
 - CSS3
 - Yeoman
 - Grunt
 - Test Driven Development

##### User Stories

 - As a user, I can create a standard or commander deck
 - As a user, I can search the database for cards to add to my deck
 - As a user, when I select a card, I can see the image of the card
 - As a user, I can save my deck and view it later.


##### Notes

on card submit, clear search and move cursor to input
on deck save, toast
maybe on click searchbar, highlight all?
after first save, second save gives error
onclick toggle on decks needs work