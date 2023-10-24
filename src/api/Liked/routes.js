const routes = (handler) => [
    // routes untuk album
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postSongsPlaylistHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getSongsPlaylistByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: handler.deleteSongPlaylistByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
  ];
  
  module.exports = routes;