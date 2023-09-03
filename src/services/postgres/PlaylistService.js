const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBPlaylistToModel } = require('../../utils/indexPlaylist');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();

    // this._collaborationService = collaborationService;
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

  async getPlaylist(owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE owner = $1',
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

//   async verifyPlaylistAccess(PlaylistId, userId) {
//     try {
//       await this.verifyPlaylistOwner(PlaylistId, userId);
//     } catch (error) {
//       if (error instanceof NotFoundError) {
//         throw error;
//       }
//       try {
//         await this._collaborationService.verifyCollaborator(PlaylistId, userId);
//       } catch {
//         throw error;
//       }
//     }
//   }
}

module.exports = PlaylistService;