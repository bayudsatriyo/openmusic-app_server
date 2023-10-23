const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { ProducerService, playlistService, validator }) => {
    const exportsHandler = new ExportsHandler(ProducerService, playlistService, validator);
    server.route(routes(exportsHandler));
  },
};
