const routes = (handler) => [
    // routes untuk album
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postLikesHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getLikedByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: handler.deleteLikedByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
  ];
  
  module.exports = routes;