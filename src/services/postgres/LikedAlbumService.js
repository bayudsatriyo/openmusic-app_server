const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikeAlbumService {
    constructor(cacheService) {
      this._pool = new Pool();
      this._cacheService = cacheService;
    }

    async postLikedAlbum(userId, albumId) {
      const query2 = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
        values: [albumId, userId],
      };
      const result2 = await this._pool.query(query2);
      const cekAlbum = result2.rows[0];
      console.log(cekAlbum);
      if (result2.rows.length) {
        throw new InvariantError('anda sudah like album tersebut');
      }
        const id = `liked-${nanoid(16)}`;
          const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING album_id',
            values: [id, userId, albumId],
          };
    
          const result = await this._pool.query(query);
    
          if (!result.rows[0].album_id) {
            throw new InvariantError('Album gagal dilike');
          }
          
          await this._cacheService.delete(`albums:${albumId}`);
          return result.rows[0].album_id;
    }

    async cekAlbumById(album_id) {
          const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [album_id],
          };

          const result = await this._pool.query(query);

          if (!result.rows.length) {
            throw new NotFoundError('Albums tidak ditemukan');
          }
    }

    async getAlbumLikedById(album_id) {
      try{
      // mendapatkan catatan dari cache
      const countLike = await this._cacheService.get(`albums:${album_id}`);
      const result = {
        count: JSON.parse(countLike),
        header: 'cache', 
      }
      return result;
      } catch (error){

      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [album_id],
      };

      const result = await this._pool.query(query);
      const countLike = parseInt(result.rows[0].count);

      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this._cacheService.set(`albums:${album_id}`, JSON.stringify(countLike));
      const result2 = {
        count: countLike,
        header: 'origin', 
      }
      return result2;
    }
}

    async deleteAlbumLikedById(album_id, user_id) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [album_id, user_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Liked Album gagal. anda belum like album tersebut');
    }

    await this._cacheService.delete(`albums:${album_id}`);
  }

}

module.exports = LikeAlbumService;