/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('musics', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
          },
          name: {
            type: 'TEXT',
            notNull: true,
          },
          year: {
            type: 'INTEGER',
            notNull: true,
          },
          songs: {
            type: 'TEXT[]',
            notNull: false,
          }
    })

    pgm.createTable('songs', {
      id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
      title: {
          type: 'TEXT',
          notNull: true,
        },
      year: {
          type: 'INTEGER',
          notNull: true,
        },
      genre: {
          type: 'TEXT',
          notNull: true,
        },
      performer: {
          type: 'TEXT',
          notNull: true,
        },
      duration: {
          type: 'INTEGER',
          notNull: false,
        },
  })
  
};

exports.down = pgm => {
    pgm.dropTable('musics');
    pgm.dropTable('songs');
};
