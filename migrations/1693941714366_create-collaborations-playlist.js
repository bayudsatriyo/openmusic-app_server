/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('collaborations', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        playlist_id: {
          type: 'VARCHAR(50)',
          unique: true,
          notNull: true,
        },
        user_id: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
      });

      pgm.addConstraint('collaborations', 'fk_collaborations.userid_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  
    pgm.dropConstraint('collaborations', 'fk_collaborations.userid_users.id');
    
    pgm.dropTable('collaborations');
};
