const mapDBSongPlaylistToModel = ({
  id,
  name,
  username,
  owner,
  songs,
}) => ({
  id,
  name,
  username,
  owner,
  // eslint-disable-next-line no-nested-ternary
  songs: Array.isArray(songs) ? songs : (songs ? JSON.parse(songs) : []),
});

module.exports = { mapDBSongPlaylistToModel };
