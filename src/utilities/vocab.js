/**
 *
 * @param {String[]|Number[]} values
 * @param maxThreshold
 * @constructor
 */
export default class Vocab {
  constructor(values, maxThreshold) {
    maxThreshold = maxThreshold || 0;
    this.values = values;
    // go over all characters and keep track of all unique ones seen
    // count up all characters
    this.indexTable = {};
    this.characterTable = {};
    this.characters = [];
    let tempCharactersTable = {};
    for (let vocabIndex = 0, vocabLength = values.length; vocabIndex < vocabLength; vocabIndex++) {
      var characters = values[vocabIndex].toString();
      for (let characterIndex = 0, charactersLength = characters.length; characterIndex < charactersLength; characterIndex++) {
        let character = characters[characterIndex];
        if (character in tempCharactersTable) continue;
        tempCharactersTable[character] = true;
        this.characters.push(character);
      }
    }

    // filter by count threshold and create pointers

    // NOTE: start at one because we will have START and END tokens!
    // that is, START token will be index 0 in model letter vectors
    // and END token will be index 0 in the next character softmax
    let charactersLength = this.characters.length;
    for(let characterIndex = 0; characterIndex < charactersLength; characterIndex++) {
      let character = this.characters[characterIndex];
      if(characterIndex >= maxThreshold) {
        // add character to vocab
        this.indexTable[character] = characterIndex;
        this.characterTable[characterIndex] = character;
      }
    }
  }

  toIndexes(phrase, maxThreshold = 0) {
    let result = [];
    let indexTable = this.indexTable;

    for (let i = 0, max = phrase.length; i < max; i++) {
      let character = phrase[i];
      let index = indexTable[character];
      if (index < maxThreshold) continue;
      result.push(index);
    }

    return result;
  }

  toCharacters(indexes, maxThreshold = 0) {
    let result = [];
    let characterTable = this.characterTable;

    for (let i = 0, max = indexes.length; i < max; i++) {
      let index = indexes[i];
      if (index < maxThreshold) continue;
      let character = characterTable[index];
      result.push(character);
    }

    return result;
  }
}