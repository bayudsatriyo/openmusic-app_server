  const routes = (handler) => [
    // routes untuk album
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'POST',
      path: '/playlists/{id}/songs',
      handler: handler.postSongsPlaylistHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistsHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    // {
    //   method: 'GET',
    //   path: '/playlist/{id}',
    //   handler: handler.getPlaylistByIdHandler,
    //   options: {
    //     auth: 'musicsapp_jwt',
    //   },
    // },
    {
      method: 'GET',
      path: '/playlists/{id}/songs',
      handler: handler.getSongsPlaylistByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}',
      handler: handler.deletePlaylistByIdHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
  ];
   
  module.exports = routes;