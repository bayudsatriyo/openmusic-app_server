const mapDBPlaylistToModel = ({
    id,
    name,
    username,
    owner,
  }) => ({
    id,
    name,
    username,
    owner,
  });
  
  module.exports = { mapDBPlaylistToModel };