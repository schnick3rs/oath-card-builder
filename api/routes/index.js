module.exports = (app) => {
  // auth
  app.use('/canvas', require('./canvasService'));
  app.use('/proxy', require('./imageProxyService'));
};
