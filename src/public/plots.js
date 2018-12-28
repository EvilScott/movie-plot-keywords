(async function(hl) {
  const decoder = new TextDecoder('utf8');
  const decode = (value) => decoder.decode(value, { stream: true });

  const searchForm = document.getElementById('search');
  const termInput = document.getElementById('term');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await searchForTerm(termInput.value)
  });

  const createMovieBox = (movie) => {
    const movieBox = document.createElement('div');
    movieBox.setAttribute('class', 'movie box');
    movieBox.setAttribute('id', `movie-${movie.movie_id}`);

    const h3 = document.createElement('h3');
    h3.setAttribute('class', 'title');
    h3.append(document.createTextNode(movie.title)); // TODO add link?

    const h4 = document.createElement('h4');
    h4.setAttribute('class', 'subtitle');
    h4.append(document.createTextNode(movie.year));

    const div = document.createElement('div');
    div.setAttribute('class', 'content'); // TODO click to expand
    div.innerHTML = movie.plot;

    const tags = document.createElement('div');
    tags.setAttribute('class', 'tags');
    for (const kw of movie.keywords) {
      const tag = document.createElement('span');
      tag.setAttribute('class', 'tag');
      tag.append(document.createTextNode(kw));
      tags.append(tag);
    }

    for (const el of [ h3, h4, tags, div ]) {
      movieBox.append(el);
    }

    return movieBox;
  };

  const showLoader = () => {
    document.getElementById('search-btn').setAttribute('class', 'button is-primary is-loading');
  };

  const hideLoader = () => {
    document.getElementById('search-btn').setAttribute('class', 'button is-primary');
  };

  const searchForTerm = async (term) => {
    const movieTarget = document.getElementById('results');
    movieTarget.innerHTML = '';
    showLoader();

    const res = await fetch(`/api/movies/search/${term}`);
    const reader = res.body.getReader();
    //TODO handle no results?

    hl(async (push, next) => {
      const { done, value } = await reader.read();
      if (done) return push(null, hl.nil);
      push(null, value);
      next();
    }).map(decode)
      .split('\n')
      .map(JSON.parse)
      .map(movie => {
        movie.plot = movie.plot.split('\n').map(p => `<p>${p}</p>`).join('');
        return movie;
      })
      .map(createMovieBox)
      .each(el => movieTarget.append(el))
      .done(hideLoader);
  };

})(highland);
