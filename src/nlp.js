const request = require('request-promise-native');

const KEYWORD_ENDPOINTS = [
  'gensim/textrank-keywords',
  'nlp/rake-keywords',
  'nlp/textrank-keywords',
];

module.exports = {
  keywords: (content) => {
    const keywordPromises = KEYWORD_ENDPOINTS.map((url) => {
      return request({
        body: content,
        headers: { 'content-type': 'text/plain' },
        method: 'POST',
        url: `nlp:5000/${url}`
      });
    });
    return Promise.all(keywordPromises);
  },
};
