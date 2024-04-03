import Word from './Word';

export default class Deck {
  words: Word[];
  innerDecks?: Deck[];

  constructor(words: Word[], innerDecks?: Deck[]) {
    this.words = words;
    this.innerDecks = innerDecks;
  }

  numberOfCertainLevelWords(level: number) {
    return this.words.map((word) => word.knowledgeLevel === level).length;
  }

  get totalNumberOfWords() {
    return this.words.length;
  }

  get numberOfLearnedWords() {
    return this.words.map((word) => word.knowledgeLevel < 4).length;
  }

  get wordsToLearn() {
    return this.words.map((word) => word.knowledgeLevel <= 2);
  }

  get learnedWords() {
    return this.words.map((word) => word.knowledgeLevel >= 3);
  }
}
