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
    if(songs == null){
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
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Albums tidak ditemukan');
      }

      const cekAlbum = result.rows.map(mapDBToModel)[0];
      if(cekAlbum.songs === null){
        cekAlbum.songs = [];
        return cekAlbum;
      }
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

  async putSongInAlbum(albumId, songsId){
    const querySongs = {
      text: 'SELECT songs FROM albums WHERE id = $1',
      values: [albumId],
    }; 

    const tmpSongs = await this._pool.query(querySongs);
    if(tmpSongs.rows[0].songs === null){
      const arrayTmpSongsId = [];
      arrayTmpSongsId[0] = songsId;
      const queryPushSongs = {
        text: 'UPDATE albums SET songs = $1 WHERE id = $2 RETURNING id, name, year, songs',
        values: [arrayTmpSongsId, albumId],
      };
  
      const resultPushSongs = await this._pool.query(queryPushSongs);
      return resultPushSongs.rows.map(mapDBToModel);
    }else{
      // return tmpSongs.rows.map(mapDBToModel)[0].songs;
    const pushSong = tmpSongs.rows.map(mapDBToModel)[0].songs;
    pushSong.push(songsId);
    
    const query = {
      text: 'UPDATE albums SET songs = $1 WHERE id = $2 RETURNING id, name, year, songs',
      values: [pushSong, albumId],
    };

    const result = await this._pool.query(query);
    // cek errorrnya !!!!!!!!
    // if (!result.rows.length) {
    //   throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    // }
    
    return result.rows.map(mapDBToModel);
    }
  }

  // Song Service
  async addSong({ title, year, genre, performer, duration, albumId }) {
    if(albumId === null || albumId == '' || albumId == undefined){
      const id = "songs-" + nanoid(16);

      const query = {
        text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [id, title, year, genre, performer, duration],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows[0].id) {
        throw new InvariantError('Songs gagal ditambahkan');
      }
      return result.rows[0].id;
    }
    const tmpAllIdMusic = await this._pool.query('SELECT id FROM albums');
    const tmpIdAlbum = tmpAllIdMusic.rows.map(mapDBToModel);
    let tmpSearchIdAlbum = '';
    tmpIdAlbum.forEach(item => {
      if (item.id === albumId) {
          tmpSearchIdAlbum = item.id;
      }
    });
    if (tmpSearchIdAlbum == '') {
      throw new NotFoundError('Gagal Menambahkan music. Id tidak ditemukan');
    }

      const id = "songs-" + nanoid(16);

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

  async editSongById(id, { title, year, genre, performer, duration }) {
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
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id, albumId',
      values: [id],
    };
 
    const result = await this._pool.query(query);

 
    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
    if(Object.keys(result.rows[0]).length > 1 && result.rows[0].albumid !== null){
      const albumId = result.rows[0].albumid;
      const queryDelSong = {
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [albumId],
      };

      const tmpSongs = await this._pool.query(queryDelSong);
      const arraySongs = tmpSongs.rows.map(mapDBToModel)[0].songs;


      for (let i = arraySongs.length - 1; i >= 0; i--) {
        if (arraySongs[i] === id) {
          arraySongs.splice(i, 1);
        }
      }

      const queryUpdate = {
        text: 'UPDATE albums SET songs = $1 WHERE id = $2 RETURNING id, name, year',
        values: [arraySongs, albumId],
      };

      const resultUpdate = await this._pool.query(queryUpdate);

      if (!resultUpdate.rows.length) {
        throw new NotFoundError('Gagal menghapus lagu dari album. Album Id tidak ditemukan');
      }

      return ("songs telah dihapus dari Album");
    }else{
      return result.rows[0].id;
    }

  }
  

}

module.exports = AlbumsService;