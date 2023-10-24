const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikeAlbumService {
    constructor() {
      this._pool = new Pool();
    }

    async likedAlbum(userId, albumId) {
        const id = `liked-${nanoid(16)}`;
          const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
          };
    
          const result = await this._pool.query(query);
    
          if (!result.rows[0].id) {
            throw new InvariantError('Album gagal dilike');
          }
    
          return result.rows[0].id;
    }

    async cekAlbumLikedById(album_id, user_id) {
          const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [album_id],
          };

          const result = await this._pool.query(query);

          if (!result.rows.length) {
            throw new NotFoundError('Albums tidak ditemukan');
          }
          const query2 = {
            text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
            values: [album_id, user_id],
          };
          const result2 = await this._pool.query(query2);
          const cekAlbum = result2.rows[0];
          console.log(cekAlbum);
          if (result2.rows.length) {
            throw new NotFoundError('anda sudah like album tersebut');
          }
    }

    async deleteAlbumLikedById(album_id, user_id) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [album_id, user_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Liked Album gagal. Id tidak ditemukan');
    }
  }

}

module.exports = LikeAlbumService;