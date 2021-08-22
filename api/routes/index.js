module.exports = (app) => {
  // auth
  app.use('/canvas', require('./canvasService'));
  app.use('/image', require('./imageProxyService'));
};
