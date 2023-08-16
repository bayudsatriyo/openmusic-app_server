require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/musics');
const AlbumsService = require('./services/postgres/MusicService');
const AlbumsValidator = require('./validator/musics');
 
 
const init = async () => {
  const albumsService = new AlbumsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();