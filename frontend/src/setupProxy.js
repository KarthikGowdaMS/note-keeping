// In your React app's setupProxy.js or setupProxy.js file
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://karthik-notes-keeping.azurewebsites.net/',
      changeOrigin: true,
    })
  );
};
