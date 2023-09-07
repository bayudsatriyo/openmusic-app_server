/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_song', {
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
    });

    pgm.addConstraint('playlist_song', 'fk_playlist_song.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_song', 'fk_playlist_song.song_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {};
