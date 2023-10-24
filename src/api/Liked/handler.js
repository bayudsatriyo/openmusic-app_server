const ClientError = require('../../exceptions/ClientError');

class LikesHandler {
    constructor(service) {
        this._service = service;

        this.postLikesHandler = this.postLikesHandler.bind(this);
        this.getLikedByIdHandler = this.getLikedByIdHandler.bind(this);
        this.deleteLikedByIdHandler = this.deleteLikedByIdHandler.bind(this);
    }

    async postLikesHandler(request, h){
        try{
            const { id } = request.params;
            const { id: credentialId} = request.auth.credentials;

            await this._service.cekAlbumById(id);
            const album_id = await this._service.postLikedAlbum(credentialId, id);

            const response = h.response({
                status: 'success',
                message: `${album_id} Liked`,
              });
              response.code(201);
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

    async getLikedByIdHandler(request, h) {
        try {
          const { id } = request.params;
    
          const count = await this._service.getAlbumLikedById(id);
    
          const response = h.response({
            status: 'success',
            data: {
              likes: count,
            },
          });
          response.code(200);
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

      async deleteLikedByIdHandler(request, h) {
        try {
          const { id } = request.params;
          const { id: credentialId } = request.auth.credentials;
    
          await this._service.cekAlbumById(id);
          await this._service.deleteAlbumLikedById(id, credentialId);
    
          const response = h.response({
            status: 'success',
            message: 'Unlike berhasil',
          });
          response.code(200);
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

module.exports = LikesHandler;