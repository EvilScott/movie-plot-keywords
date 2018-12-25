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

    let div = document.createElement('div');
    div.setAttribute('class', 'content'); // TODO click to expand
    div.innerHTML = movie.plot;

    for (const el of [ h3, h4, div ]) {
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
    //TODO handle no results

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
      .each(el => {
        // TODO turn off loading
        movieTarget.append(el);
      });
  };

})(highland);
