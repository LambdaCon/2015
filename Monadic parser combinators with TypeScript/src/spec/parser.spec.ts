declare var require;
declare var describe;
declare var it;
declare var expect;

var parse = require('../parser');

describe('parser', () => {

  describe('item', () => {

    it('should parse the first character', () => {
      var result = parse.item('hello');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(['h', 'ello']);
    });

    it('should fail with empty string', () => {
      var result = parse.item('');

      expect(result.length).toBe(0);
    });

  });

  describe('zero', () => {

    it('should always fail', () => {
      expect(parse.zero()('hello').length).toBe(0);
    });

  });

  describe('plus', () => {

    it('should concatenate the results of applying both parsers on the input', () => {
      var result = parse.plus(parse.item, parse.item)('hello');

      expect(result.length).toBe(2);
      expect(result[0]).toEqual(['h', 'ello']);
      expect(result[1]).toEqual(['h', 'ello']);
    });

  });

  describe('pplus', () => {

    it('should return the first result', () => {
      var result = parse.pplus(parse.item, parse.item)('hello');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(['h', 'ello']);
    });

  });

  describe('seq', () => {

    it('apply parsers in sequence', () => {
      var result = parse.seq(parse.item, parse.item)('hello');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([['h', 'e'], 'llo']);
    });

  });

  describe('naiveSeq', () => {

    it('should work', () => {
      var result = parse.naiveSeq(parse.item, parse.item)('hello');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([['h', 'e'], 'llo']);
    });

  });

  describe('sat', () => {

    it('should parse when condition matches', () => {
      var result = parse.sat(Number)('1A');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(['1', 'A']);
    });

    it('should fail when not matching', () => {
      var result = parse.sat(Number)('a');

      expect(result.length).toBe(0);
    });

  });

  describe('char', () => {

    it('should match one char', () => {
      var results = parse.char('c')('ciao');

      expect(results.length).toBe(1);
      expect(results[0][0]).toBe('c');
      expect(results[0][1]).toBe('iao');
    });

  });

  describe('string', () => {

    it('should return empty string for empty string', () => {
      var result = parse.string('')('hello');
      expect(result.length).toBe(1);
      expect(result[0][0]).toBe('');
    });

    it('should parse matching string', () => {
      var result = parse.string('hello')('helloWorld');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(['hello', 'World']);
    });

  });

  describe('many', () => {

    it('should concatenate the results', () => {
      var result = parse.many(parse.char('c'))('ccD');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([['c', 'c'], 'D']);
    });

    it('should return empty array when it cannot parse', () => {
      var result = parse.many(parse.char('c'))('D');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([[], 'D']);
    });

  });

  describe('many1', () => {

    it('should concatenate the results', () => {
      var result = parse.many1(parse.char('c'))('ccCC');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([['c', 'c'], 'CC']);
    });

    it('should fail when it cannot parse', () => {
      var result = parse.many1(parse.char('c'))('D');

      expect(result.length).toBe(0);
    });

  });

  describe('sepby1', () => {

    it('should parse letters separated by digits', () => {
      var result = parse.sepby1(parse.letter, parse.digit)('a1b2c3');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([['a', 'b', 'c'], '3']);
    });

    it('should fail', () => {
      var result = parse.sepby1(parse.letter, parse.digit)('ab2c');

      expect(result.length).toBe(1);
      expect(result[0][0]).toEqual(['a']);
      expect(result[0][1]).toBe('b2c');
    });

  });

  describe('sepby', () => {

    it('should parse letters separated by digits', () => {
      var result = parse.sepby(parse.letter, parse.digit)('a1b2c');

      expect(result.length).toBe(1);
      expect(result[0][0]).toEqual(['a', 'b', 'c']);
      expect(result[0][1]).toBe('');
    });

    it('should fail', () => {
      var result = parse.sepby(parse.letter, parse.digit)('ab2c');

      expect(result.length).toBe(1);
      expect(result[0][0]).toEqual(['a']);
      expect(result[0][1]).toBe('b2c');
    });

  });

  describe('chainl1', () => {

    it('should parse digits and sum them up', () => {
      var res = parse.chainl1(
        parse.digit.bind(x => parse.unit(parseInt(x))),
        parse.unit(a => b => a + b))('123a');

      expect(res[0]).toEqual([6, 'a']);
    });

  });

  describe('addop', () => {

    it('should add numbers', () => {
      var result = parse.addop('+')[0][0](1)(2);

      expect(result).toBe(3);
    });

  });

  describe('mulop', () => {

    it('should multiply numbers', () => {
      var result = parse.mulop('*')[0][0](2)(2);

      expect(result).toBe(4);
    });

  });

  describe('factor', () => {

    it('should parse digit', () => {
      expect(parse.factor('1')[0][0]).toBe(1);
    });

    it('should parse parenthesised expression', () => {
      expect(parse.factor('(1)')[0][0]).toBe(1);
    });

  });

  describe('expr', () => {

    it('should parse and evaluate arithmetic expression', () => {
      var result = parse.apply(parse.expr, ' 1 - 2 * (3 - 1) + 2 ');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual([-1, '']);
    });

  });

});