  const routes = (handler) => [
    // routes untuk album
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums',
      handler: handler.getAlbumsHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putAlbumByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },

    // routes untuk songs
    {
      method: 'POST',
      path: '/songs',
      handler: handler.postSongHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/songs',
      handler: handler.getSongsHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/songs/{id}',
      handler: handler.getSongByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'PUT',
      path: '/songs/{id}',
      handler: handler.putSongByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/songs/{id}',
      handler: handler.deleteSongByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
  ];
   
  module.exports = routes;