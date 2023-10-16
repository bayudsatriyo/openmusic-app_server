const mapDBToModel = ({
  id,
  name,
  year,
  songs,
}) => ({
  id,
  name,
  year,
  // eslint-disable-next-line no-nested-ternary
  songs: Array.isArray(songs) ? songs : (songs ? JSON.parse(songs) : []),
});

module.exports = { mapDBToModel };
