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
    if (songs == null) {
      const query = {
        text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
        values: [id, name, year],
      };

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Album gagal ditambahkan');
      }

      return result.rows[0].id;
    }
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, [songs]],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModel);
  }

  async getAlbumById(id) {
    const query = {
      // eslint-disable-next-line quotes
      text: `SELECT albums.id, albums.name, albums.year, json_agg(json_build_object( 'id', songs.id, 'title', songs.title, 'performer', songs.performer)) AS songs FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1 GROUP BY albums.id;`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      // bila album tidak memiliki songs
      const query2 = {
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [id],
      };
      const result2 = await this._pool.query(query2);
      const cekAlbum = result2.rows.map(mapDBToModel)[0];
      delete cekAlbum.cover;
      console.log(result2.rows);
      if (!result2.rows.length) {
        throw new NotFoundError('Albums tidak ditemukan');
      }
      return cekAlbum;
    }
    const cekAlbum = result.rows.map(mapDBToModel)[0];
    delete cekAlbum.cover;
    return cekAlbum;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async addCoverAlbumById(id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Songs gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');

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

    return result.rows.map(mapSongToModel)[0];
  }

  async getSongByTitle(title) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
      values: [`%${title}%`],
    };
    const result = await this._pool.query(query);
    console.log(result.rows);

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return result.rows.map(mapSongToModel);
  }

  async getSongByPerformer(performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
      values: [`%${performer}%`],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return result.rows.map(mapSongToModel);
  }

  async getSongByTitlePerformer(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await this._pool.query(query);
    console.log(`ini title :${title}`);
    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return result.rows.map(mapSongToModel);
  }

  async editSongById(id, {
    title, year, genre, performer, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, genre, performer, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

    return result;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('gagal menghapus song. Id tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = AlbumsService;
