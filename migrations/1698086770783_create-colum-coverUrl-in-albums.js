/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
      pgm.addColumn('albums', {
      cover: {
          type: 'TEXT',
          notNull: false,
      },
    });
};

exports.down = pgm => {
    pgm.dropColumn('albums', 'cover');
};
