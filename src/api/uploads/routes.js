const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums/{id}/covers',
      handler: handler.postUploadCoverHandler,
      options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          output: 'stream',
          maxBytes: 512000, // 512KB
        },
      },
    },
  ];
   
  module.exports = routes;