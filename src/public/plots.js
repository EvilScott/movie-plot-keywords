(async function(hl) {
  const decoder = new TextDecoder('utf8');
  const decode = (value) => decoder.decode(value, { stream: true });

  const createMovieBox = (movie) => {
    let movieBox = document.createElement('div');
    movieBox.setAttribute('class', 'movie box');

    let h3 = document.createElement('h3');
    h3.setAttribute('class', 'title');
    h3.append(document.createTextNode(movie.title));

    let h4 = document.createElement('h4');
    h4.setAttribute('class', 'subtitle');
    h4.append(document.createTextNode(movie.year));

    let p = document.createElement('p');
    p.setAttribute('class', 'content');
    p.append(document.createTextNode(movie.plot));

    for (const el of [ h3, h4, p ]) {
      movieBox.append(el);
    }

    // TODO keyword "tags" as <span class="tag">Foo</span>

    return movieBox;
  };

  let movieTarget = document.getElementById('results');
  movieTarget.innerHTML = '';

  const res = await fetch('/api/movies');
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
    .each(el => movieTarget.append(el));

})(highland);
