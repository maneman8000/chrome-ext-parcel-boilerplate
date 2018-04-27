const testEval = () => {
  const expr = 'console.log("test eval", getEventListeners)';
  chrome.devtools.inspectedWindow.eval(expr, (isLoaded, isException) => {
    if (isException) {
      throw new Error('Eval failed for ' + expr);
    }
    console.log('eval success!', isLoaded);
  });
};

const reloadPage = () => {
  const options = {
    ignoreCache: true
  };
  chrome.devtools.inspectedWindow.reload(options);
};

window.addEventListener('load', () => {
  var reloadButton = document.querySelector('.reload-button');
  reloadButton.addEventListener('click', reloadPage);
});
