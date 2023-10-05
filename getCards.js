const wordsList = require("./wordsList");

function getRandomCards(arr) {
  const limitCard = 25;
  const randomCards = [];

  for (let i = 0; randomCards.length < limitCard; i++) {
    const randomIndex = Math.floor(Math.random() * limitCard);
    const randomValue = arr[randomIndex];
    if (!randomCards.includes(randomValue)) {
      randomCards.push(randomValue);
    }
  }

  return randomCards;
}

const wordsListData = getRandomCards(wordsList);
console.log("wordsListData:", wordsListData);

module.exports = wordsListData;
