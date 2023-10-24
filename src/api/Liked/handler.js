const ClientError = require('../../exceptions/ClientError');

class LikesHandler {
    constructor(service) {
        this._service = service;

    }

    async postLikesHandler(request, h){
        try{
            const { id } = request.params;
            const { id: credentialId} = request.auth.credentials;

            await service.cekAlbumLikedById(id, credentialId);

            const response = h.response({
                status: 'success',
                message: 'Albums Liked',
              });
              response.code(200);
              return response;
        }catch (error){
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