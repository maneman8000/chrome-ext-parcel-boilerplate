(() => {
  const traverse = (n, cb) => {
    cb(n);
    for (let i = 0; i < n.children.length; i++) {
      const c = n.children[i];
      if (c.tagName) {
        traverse(c, cb);
      }
    }
  };

  const getSelector = (node) => {
    const p = [];
    let n = node;
    while (n.parentNode && n.parentNode.tagName) {
      let ii = 0;
      let nn = n.previousSibling;
      let only = true;
      while(nn) {
        if (nn.tagName) ii += 1;
        if (nn.tagName && nn.tagName === node.tagName) only = false;
        nn = nn.previousSibling;
      }
      if (only) {
        ii = 0;
      }
      const i = ii>0 ? ii+1 : 0;
      if (i > 0) {
        p.push({n:n.tagName, i:i});
      }
      else {
        p.push({n:n.tagName});
      }
      n = n.parentNode;
    }
    p.push({n:n.tagName});
    return p.slice().reverse().map((p) => {
      if (p.i) {
        return p.n + ':nth-child(' + p.i + ')';
      }
      else {
        return p.n;
      }
    }).join(' > ').toLowerCase();
  };

  const result = [];

  traverse(document.body, (node) => {
    const listeners = getEventListeners(node);
    const events = Object.keys(listeners);
    if (events.length > 0) {
      const sel = getSelector(node);
      result.push({
        selector: sel,
        events: events
      });
    }
  });

  // console.log(result);
  return {result};
})();
