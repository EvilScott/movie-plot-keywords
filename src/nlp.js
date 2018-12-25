const request = require('request-promise-native');

const KEYWORD_ENDPOINTS = [
  'gensim/textrank-keywords',
  'nlp/rake-keywords',
  // 'nlp/textrank-keywords',
];

module.exports = {
  addKeywords: async (movie) => {
    const keywordPromises = KEYWORD_ENDPOINTS.map((url) => {
      return request({
        body: movie.plot,
        headers: { 'content-type': 'text/plain' },
        json: true,
        method: 'POST',
        url: `http://nlp:5000/${url}`
      });
    });
    const [ a, b ] = await Promise.all(keywordPromises);
    movie.keywords = Array.from(new Set([ ...a, ...b ]));
    return movie;
  },
};
