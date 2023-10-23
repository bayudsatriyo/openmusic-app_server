const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(ProducerService, playlistService, validator) {
    this._producerService = ProducerService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistPayload(request.payload);
      const { playlistId } = request.params;
      const message = {
        userId: request.auth.credentials.id,
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      console.log(message);
      await this._playlistService.verifyPlaylistOwner(message.playlistId, message.userId);
      await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
