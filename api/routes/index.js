module.exports = (app) => {
  // auth
  app.use('/canvas', require('./canvasService'));
};
