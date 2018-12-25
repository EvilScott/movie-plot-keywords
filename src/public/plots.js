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
    let movieBox = document.createElement('div');
    movieBox.setAttribute('class', 'movie box');

    let h3 = document.createElement('h3');
    h3.setAttribute('class', 'title');
    h3.append(document.createTextNode(movie.title));

    let h4 = document.createElement('h4');
    h4.setAttribute('class', 'subtitle');
    h4.append(document.createTextNode(movie.year));

    let p = document.createElement('p'); //TODO nl2br
    p.setAttribute('class', 'content');
    p.append(document.createTextNode(movie.plot));

    for (const el of [ h3, h4, p ]) {
      movieBox.append(el);
    }

    // TODO keyword "tags" as <span class="tag">Foo</span>

    return movieBox;
  };

  const searchForTerm = async (term) => {
    const movieTarget = document.getElementById('results');
    movieTarget.innerHTML = '';
    // TODO set loading

    const res = await fetch(`/api/movies/search/${term}`);
    const reader = res.body.getReader();

    hl(async (push, next) => {
      const { done, value } = await reader.read();
      if (!done) {
        push(null, value);
        return next();
      }
      push(null, hl.nil);
    }).map(decode)
      .split('\n')
      .map(JSON.parse)
      .map(createMovieBox)
      .each(el => {
        // TODO turn off loading
        movieTarget.append(el);
      });
  };

})(highland);
