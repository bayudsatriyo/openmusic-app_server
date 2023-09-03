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
      handler: handler.getPlaylistHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlist/{id}',
      handler: handler.getPlaylistIdHandler,
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