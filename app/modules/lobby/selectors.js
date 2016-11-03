
export const selectLobbyTables = ({ lobby }) =>
  lobby.tables && Object.keys(lobby.tables)
    .map(id => lobby.tables[id])
