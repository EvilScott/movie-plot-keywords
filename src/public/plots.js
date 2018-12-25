(async function(hl) {
  const decoder = new TextDecoder('utf8');
  const decode = (value) => decoder.decode(value, { stream: true });

  let done = false;
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
    .done(() => done = true)

})(highland);
