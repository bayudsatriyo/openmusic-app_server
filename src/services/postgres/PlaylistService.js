const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBPlaylistToModel } = require('../../utils/indexPlaylist');
const { mapDBSongPlaylistToModel } = require('../../utils/indexSongPlaylist');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapActivitiesToModel } = require('../../utils/indexActivities');

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
    console.log("data ditambahkan");
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
    //To Do : tambah parameter owner
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

  async getSongsPlaylistById(id) {
    //beri username jhon
    const query = {
      text: 'SELECT playlist.id, playlist.name, users.username AS username, playlist.songs FROM playlist JOIN users ON playlist.owner = users.id WHERE playlist.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const songs = result.rows.map(mapDBSongPlaylistToModel)[0].songs;
    const objekLagu = [];
    
    songs.forEach(function (element) {
      try {
        let parsedObject = JSON.parse(element);
        objekLagu.push(parsedObject);
      } catch (error) {
        console.error('Tidak dapat mengurai elemen sebagai JSON valid:', error);
      }
    });
    const finalresult = result.rows.map(mapDBSongPlaylistToModel)[0];
    finalresult.songs = objekLagu;
    return finalresult;
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

  async addSongPlaylistById(id, { songId }) {
    const querySongs = {
      text: 'SELECT songs FROM playlist WHERE id = $1',
      values: [id],
    };

    const tmpSongs = await this._pool.query(querySongs);

    if (tmpSongs.rows[0].songs === null) {
      const arrayTmpSongsId = [];
      arrayTmpSongsId[0] = await this.verifySong(songId);
      console.log(arrayTmpSongsId[0]);
      const queryPushSongs = {
        text: 'UPDATE playlist SET songs = $1 WHERE id = $2 RETURNING id, name, songs',
        values: [arrayTmpSongsId, id],
      };

      const resultPushSongs = await this._pool.query(queryPushSongs);
      return resultPushSongs.rows.map(mapDBSongPlaylistToModel);
    } else {
      // return tmpSongs.rows.map(mapDBToModel)[0].songs;
      const pushSong = tmpSongs.rows.map(mapDBSongPlaylistToModel)[0].songs;
      pushSong.push(await this.verifySong(songId));

      const query = {
        text: 'UPDATE playlist SET songs = $1 WHERE id = $2 RETURNING id, name, songs',
        values: [pushSong, id],
      };

      const result = await this._pool.query(query);
      // cek errorrnya !!!!!!!!
      // if (!result.rows.length) {
      //   throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
      // }

      return result.rows.map(mapDBSongPlaylistToModel);
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);


    if (!result.rows.length) {
      throw new NotFoundError('playlist gagal dihapus. Id tidak ditemukan');
    };
  }

  async deleteSongPlaylistById(id, songId) {
    const querySongs = {
      text: 'SELECT songs FROM playlist WHERE id = $1',
      values: [id],
    };

    const tmpSongs = await this._pool.query(querySongs);

    if (!tmpSongs.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

      // return tmpSongs.rows.map(mapDBToModel)[0].songs;
    const pushSong = tmpSongs.rows.map(mapDBSongPlaylistToModel)[0].songs;
    console.log(pushSong)
    let kondisi = 0;
    for (let i = pushSong.length - 1; i >= 0; i--) {
      pushSong[i] = JSON.parse(pushSong[i]);
      if (pushSong[i].id === songId) {
        pushSong.splice(i, 1);
        kondisi = 1;
      }
    }

    if (!kondisi) {
      throw new InvariantError('song tidak ditemukan');
    }

      const query = {
        text: 'UPDATE playlist SET songs = $1 WHERE id = $2',
        values: [pushSong, id],
      };

      await this._pool.query(query);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM Playlist WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    };

    const Playlist = result.rows[0];

    if (Playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    };
  }

  async verifySong(songId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [songId],
    }
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    };

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
      const time = new Date().toISOString();;
  
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