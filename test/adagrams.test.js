import Adagrams from 'adagrams';

// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
const adagrams = new Adagrams();

describe('Adagrams', () => {
  describe('drawLetters', () => {
    it('draws ten letters from the letter pool', () => {
      const drawn = adagrams.drawLetters();

      expect(drawn).toHaveLength(10);
    });

    it('returns an array, and each item is a single-letter string', () => {
      const drawn = adagrams.drawLetters();

      expect(Array.isArray(drawn)).toBe(true);
      drawn.forEach((l) => {
        expect(l).toMatch(/^[A-Z]$/);
      });
    });
  });

  describe('usesAvailableLetters', () => {
    it('returns true if the submitted letters are valid against the drawn letters', () => {
      const drawn = ['D', 'O', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];
      const word = 'DOG';

      const isValid = adagrams.usesAvailableLetters(word, drawn);
      expect(isValid).toBe(true);
    });

    it('returns false when word contains letters not in the drawn letters', () => {
      const drawn = ['D', 'O', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];
      const word = 'DOG';

      const isValid = adagrams.usesAvailableLetters(word, drawn);
      expect(isValid).toBe(false);
    });

    it('returns false when word contains repeated letters more than in the drawn letters', () => {
      const drawn = ['D', 'O', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];
      const word = 'GOOD';

      const isValid = adagrams.usesAvailableLetters(word, drawn);
      expect(isValid).toBe(false);

    });
  });

  describe('scoreWord', () => {
    const expectScores = (wordScores) => {
      Object.entries(wordScores).forEach(([word, score]) => {
        expect(adagrams.scoreWord(word)).toBe(score);
      });
    };

    it('returns an accurate numerical score according to the score chart', () => {
      expectScores({
        A: 1,
        DOG: 5,
        WHIMSY: 17
      });
    });

    it('returns a score regardless of the input case', () => {
      expectScores({
        a: 1,
        dog: 5,
        wHiMsY: 17
      });
    });

    it('returns a score of 0 if given an empty input', () => {
      expectScores({
        '': 0
      });
    });

    it('adds an extra 8 points if word is 7 or more characters long', () => {
      expectScores({
        XXXXXXX: 64,
        XXXXXXXX: 72,
        XXXXXXXXX: 80,
        XXXXXXXXXX: 88,
      });
    });
  });

  describe('highestScoreFrom', () => {
    it('returns a hash that contains the word and score of best word in an array', () => {
      const words = ['X', 'XX', 'XXX', 'XXXX'];
      const correct = { word: 'XXXX', score: adagrams.scoreWord('XXXX') };

      expect(adagrams.highestScoreFrom(words)).toEqual(correct);
    });

    it('accurately finds best scoring word even if not sorted', () => {
      const words = ['XXX', 'XXXX', 'X', 'XX'];
      const correct = { word: 'XXXX', score: adagrams.scoreWord('XXXX') };

      expect(adagrams.highestScoreFrom(words)).toEqual(correct);
    });

    describe('in case of tied score', () => {
      const expectTie = (words) => {
        const scores = words.map(word => adagrams.scoreWord(word));
        const highScore = scores.reduce((h, s) => h < s ? s : h, 0);
        const tiedWords = scores.filter((s) => s == highScore);

        // Expect at least two tied words
        expect(tiedWords.length).toBeGreaterThan(1);
      };

      it('selects the word with 10 letters', () => {
        const words = ['AAAAAAAAAA', 'BBBBBB'];
        const correct = { word: 'AAAAAAAAAA', score: adagrams.scoreWord('AAAAAAAAAA') };
        expectTie(words);

        expect(adagrams.highestScoreFrom(words)).toEqual(correct);
        expect(adagrams.highestScoreFrom(words.reverse())).toEqual(correct);
      });

      it('selects the word with fewer letters when neither are 10 letters', () => {
        const words = ['MMMM', 'WWW'];
        const correct = { word: 'WWW', score: adagrams.scoreWord('WWW') };
        expectTie(words);

        expect(adagrams.highestScoreFrom(words)).toEqual(correct);
        expect(adagrams.highestScoreFrom(words.reverse())).toEqual(correct);
      });

      it('selects the first word when both have same length', () => {
        const words = ['AAAAAAAAAA', 'EEEEEEEEEE'];
        const first = { word: 'AAAAAAAAAA', score: adagrams.scoreWord('AAAAAAAAAA') };
        const second = { word: 'EEEEEEEEEE', score: adagrams.scoreWord('EEEEEEEEEE') };
        expectTie(words);

        expect(adagrams.highestScoreFrom(words)).toEqual(first);
        expect(adagrams.highestScoreFrom(words.reverse())).toEqual(second);
      });

      it('selects the first word when both have same length', () => {
        const words = ['JJJ', 'XXX'];
        const first = { word: 'JJJ', score: adagrams.scoreWord('JJJ') };
        const second = { word: 'XXX', score: adagrams.scoreWord('XXX') };
        expectTie(words);

        expect(adagrams.highestScoreFrom(words)).toEqual(first);
        expect(adagrams.highestScoreFrom(words.reverse())).toEqual(second);
      });

      it('selects the shorter word when all of them have the same scores', () => {
        const words = ['HHHHH', 'KKKK', 'VVVVV'];
        const second = { word: 'KKKK', score: adagrams.scoreWord('KKKK') };
        expectTie(words);

        expect(adagrams.highestScoreFrom(words)).toEqual(second);
        expect(adagrams.highestScoreFrom(words.reverse())).toEqual(second);
      })
    });
  });
});
