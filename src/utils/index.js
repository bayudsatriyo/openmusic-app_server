const mapDBToModel = ({
  id,
  name,
  year,
  songs,
  cover,
}) => ({
  id,
  name,
  year,
  // eslint-disable-next-line no-nested-ternary
  songs: Array.isArray(songs) ? songs : (songs ? JSON.parse(songs) : []),
  coverUrl : cover,
});

module.exports = { mapDBToModel };
