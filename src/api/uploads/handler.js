const ClientError = require('../../exceptions/ClientError');
 
class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }
 
  async postUploadCoverHandler(request, h) {
    try {
        const { cover } = request.payload;
        const { id } = request.params;
        this._validator.validateCoverHeaders(cover.hapi.headers);

        console.log(id);

        await this._albumsService.getAlbumById(id);
        const filename = await this._storageService.writeFile(cover, cover.hapi);
        const fileLocation =  `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${filename}`;
        console.log(typeof(fileLocation));
        await this._albumsService.addCoverAlbumById(id, fileLocation);
        const response = h.response({
            status: 'success',
            message: fileLocation,
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

module.exports = UploadsHandler;
