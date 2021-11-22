import * as Type from 'Type';

type Lobby = Type.Internal.Lobby;

export const complete = (lobby: Lobby) => (
  lobby.members.length === 2 &&
  lobby.members.every(member => member.ready)
);