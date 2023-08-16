const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const { mapSongToModel } = require('../../utils/indexSongs');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year, songs }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO musics VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, [songs]],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    console.log("data ditambahkan");
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM musics');
    return result.rows.map(mapDBToModel);
  }
  
  async getAlbumById(id) {
    const query = {
        text: 'SELECT * FROM musics WHERE id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Albums tidak ditemukan');
      }
      console.log(result.rows.map(mapDBToModel)[0]);
      return result.rows.map(mapDBToModel)[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
        text: 'UPDATE musics SET name = $1, year = $2 WHERE id = $3 RETURNING id',
        values: [name, year, id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
      }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM musics WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  // Song Service
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = "songs-" + nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Songs gagal ditambahkan');
    }
    console.log("Songs ditambahkan");
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    console.log('get all song');
    return result.rows.map(mapSongToModel);
  }

  async getSongById(id) {
    const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Songs tidak ditemukan');
      }
      console.log(result.rows.map(mapSongToModel)[0]);
      return result.rows.map(mapSongToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
        text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id',
        values: [title, year, genre, performer, duration, albumId, id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
      }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
  

}

module.exports = AlbumsService;