const mapDBPlaylistSongToModel = ({
  id,
  song_id,
  performer,
  title,
}) => ({
  id,
  song_id,
  performer,
  title,
});

module.exports = { mapDBPlaylistSongToModel };
