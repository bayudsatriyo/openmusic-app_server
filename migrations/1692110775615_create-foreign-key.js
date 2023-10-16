/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  //   await pgm.db.query(`
  //   ALTER TABLE songs
  //   ADD COLUMN albumId VARCHAR(50) REFERENCES musics(id) ON DELETE SET NULL;
  // `);
};

exports.down = async (pgm) => {
  //   await pgm.db.query(`
  //   ALTER TABLE songs
  //   DROP COLUMN albumId;
  // `);
};
