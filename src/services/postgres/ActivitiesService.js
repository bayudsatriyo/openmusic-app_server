const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapActivitiesToModel } = require('../../utils/indexActivities');
const { mapDBSongActivitiesToModel } = require('../../utils/indexActivities');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivitiesById(id) {
    const query = {
      text: 'SELECT songs.title AS title, users.username AS username, activities.action, activities.time \
      FROM playlist JOIN songs ON activities.song_id = songs.id \
      JOIN users ON activities.user_id = users.id\
      WHERE playlist_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activities tidak ditemukan');
    }

    return result.rows.map(mapActivitiesToModel)[0];
  }
}

module.exports = ActivitiesService;
