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
    songs,
  });
  
  module.exports = { mapDBSongPlaylistToModel };