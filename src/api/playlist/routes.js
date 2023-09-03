  const routes = (handler) => [
    // routes untuk album
    {
      method: 'POST',
      path: '/playlist',
      handler: handler.postPlaylistHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlist',
      handler: handler.getPlaylistsHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlist/{id}',
      handler: handler.getPlaylistByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlist/{id}',
      handler: handler.deletePlaylistByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
  ];
   
  module.exports = routes;