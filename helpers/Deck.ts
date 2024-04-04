import Word from './Word';

export default class Deck {
  name: string;
  words: Word[];
  innerDecks?: Deck[];

  constructor(name: string, words: Word[], innerDecks?: Deck[]) {
    this.name = name;
    this.words = words;
    this.innerDecks = innerDecks;
  }

  numberOfCertainLevelWords(level: number) {
    return this.words.filter((word) => word.knowledgeLevel === level).length;
  }

  get totalNumberOfWords() {
    return this.words.length;
  }

  get wordsToLearn() {
    return this.words.map((word) => word.knowledgeLevel <= 3);
  }

  get learnedWords() {
    return this.words.map((word) => word.knowledgeLevel === 4);
  }
}
