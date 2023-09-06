/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
          },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
          },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
          },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
          },
        action: {
            type: 'TEXT',
            notNull: true,
          },
        time: {
            type: 'TEXT',
            notNull: true,
          },
    })

    pgm.addConstraint('activities', 'fk_activities.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('activities', 'fk_activities.playlist_id');
    pgm.dropTable('activities');

};
