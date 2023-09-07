/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      name: {
        type: 'VARCHAR(50)',
        unique: true,
        notNull: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    });
    // foreign key to user id
    pgm.addConstraint('playlist', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  };


exports.down = (pgm) => {
    // menghapus constraint fk_notes.owner_users.id pada tabel notes
    pgm.dropConstraint('playlist', 'fk_playlist.owner_users.id');
    
    pgm.dropTable('playlist');
};