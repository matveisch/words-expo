export default class Word {
  word: string;
  meaning: string;
  pronunciation: string;
  knowledgeLevel: 1 | 2 | 3 | 4;

  constructor(word: string, meaning: string, pronunciation: string, knowledgeLevel: 1 | 2 | 3 | 4) {
    this.word = word;
    this.meaning = meaning;
    this.pronunciation = pronunciation;
    this.knowledgeLevel = knowledgeLevel;
  }
}
