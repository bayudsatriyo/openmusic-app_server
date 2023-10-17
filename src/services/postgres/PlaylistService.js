const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBPlaylistToModel } = require('../../utils/indexPlaylist');
const { mapDBSongPlaylistToModel } = require('../../utils/indexSongPlaylist');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapActivitiesToModel } = require('../../utils/indexActivities');
const { mapDBPlaylistSongToModel } = require('../../utils/indexPlaylistSong');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();

    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    console.log('data ditambahkan');
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlist.id, playlist.name, users.username AS username\
      FROM playlist\
      JOIN users ON playlist.owner = users.id\
      LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id\
      WHERE playlist.owner = $1 OR collaborations.user_id = $1;',
      values: [owner],
    };
    // To Do : tambah parameter owner
    const result = await this._pool.query(query);

    return result.rows.map(mapDBPlaylistToModel);
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT id, name, owner FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    return result.rows.map(mapDBPlaylistToModel)[0];
  }

  async getPlaylist_songById(id) {
    // beri username jhon
    const query = {
      // eslint-disable-next-line quotes
      text: `SELECT playlist.id AS id, playlist.name AS name, users.username AS username, json_agg(json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer)) AS songs
      FROM playlist
      JOIN playlist_song ON playlist.id = playlist_song.playlist_id
      JOIN users ON playlist.owner = users.id
      JOIN songs ON playlist_song.song_id = songs.id
      WHERE playlist.id = $1
      GROUP BY playlist.id, users.id;`,
      values: [id],
    };
    const result = await this._pool.query(query);
    const finalresult = await result.rows[0];
    if (!result.rows.length) {
      // bila album tidak memiliki songs
      const query2 = {
        text: 'SELECT\
        playlist_song.playlist_id AS id,\
        playlist.name,\
        users.username\
    FROM\
        playlist_song\
    JOIN\
        playlist ON playlist_song.playlist_id = playlist.id\
    JOIN\
        users ON playlist.owner = users.id\
    WHERE\
        playlist_song.playlist_id = $1;',
        values: [id],
      };
      const result2 = await this._pool.query(query2);
      console.log(result2.rows.map(mapDBPlaylistToModel)[0]);
      if (!result2.rows.length) {
        throw new NotFoundError('playlist tidak ditemukan');
      }
      return result2.rows[0];
    }
    return finalresult;
  }

  async getSongsPlaylist_songById(id) {
    // beri username jhon
    const query = {
      text: 'SELECT\
      playlist_song.song_id AS id,\
      songs.performer,\
      songs.title\
  FROM\
      playlist_song\
  JOIN\
      songs ON playlist_song.song_id = songs.id\
  WHERE\
      playlist_song.playlist_id = $1;',
      values: [id],
    };
    const result = await this._pool.query(query);
    console.log(result.rows);
    return result.rows.map(mapDBPlaylistSongToModel);
  }

  async editPlaylistById(id, { name }) {
    const query = {
      text: 'UPDATE playlist SET name = $1 WHERE id = $2 RETURNING id',
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui playlist. Id tidak ditemukan');
    }
  }

  async addSongPlaylistById(playlist_id, { songId }) {
    await this.verifySong(songId);
    const id = `playlist-song-${nanoid(16)}`;
    const querySongs = {
      text: 'INSERT INTO playlist_song VALUES($1, $2, $3) RETURNING id',
      values: [id, playlist_id, songId],
    };

    await this._pool.query(querySongs);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async deleteSongPlaylistById(id) {
    const querySongs = {
      text: 'DELETE FROM playlist_song WHERE song_id = $1',
      values: [id],
    };

    await this._pool.query(querySongs);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM Playlist WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const Playlist = result.rows[0];

    if (Playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifySong(songId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyPlaylistAccess(PlaylistId, userId) {
    try {
      await this.verifyPlaylistOwner(PlaylistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(PlaylistId, userId);
      } catch {
        throw error;
      }
    }
  }

  // activities Playlist
  async addActivitiesById(playlistId, action, userId, { songId }) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Activities gagal ditambahkan');
    }
  }

  async getActivitiesById(id) {
    const query = {
      text: 'SELECT activities.playlist_id, songs.title AS title, users.username AS username, activities.action, activities.time\
      FROM activities\
      JOIN songs ON activities.song_id = songs.id\
      JOIN users ON activities.user_id = users.id\
      WHERE activities.playlist_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activities tidak ditemukan');
    }
    console.log(result.rows);
    return result.rows.map(mapActivitiesToModel);
  }
}

module.exports = PlaylistService;
