const mapDBSongPlaylistToModel = ({
    id,
    name,
    owner,
    songs,
  }) => ({
    id,
    name,
    owner,
    songs,
  });
  
  module.exports = { mapDBSongPlaylistToModel };