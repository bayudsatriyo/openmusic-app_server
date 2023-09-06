  const routes = (handler) => [
    // routes untuk album
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
    },
    {
      method: 'GET',
      path: '/albums',
      handler: handler.getAlbumsHandler,
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putAlbumByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdHandler,
    },

    // routes untuk songs
    {
      method: 'POST',
      path: '/songs',
      handler: handler.postSongHandler,
    },
    {
      method: 'GET',
      path: '/songs',
      handler: handler.getSongsHandler,
    },
    {
      method: 'GET',
      path: '/songs/{id}',
      handler: handler.getSongByIdHandler,
    },
    {
      method: 'PUT',
      path: '/songs/{id}',
      handler: handler.putSongByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/songs/{id}',
      handler: handler.deleteSongByIdHandler,
    },
  ];
   
  module.exports = routes;