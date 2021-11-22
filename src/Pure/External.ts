import * as Type from 'Type';

type Member = Type.Internal.Member;
type Lobby = Type.Internal.Lobby;
type Player = Type.Internal.Player;
type Game = Type.Internal.Game;

export const member = (member: Member): Type.External.Member => ({
  nickname: member.nickname,
  color: member.color,
  ready: member.ready
});

export const lobby = (lobby: Lobby): Type.External.Lobby => ({
  _id: lobby._id,
  name: lobby.name,
  members: lobby.members.map(member)
});

export const player = (player: Player): Type.External.Player => ({
  nickname: player.nickname,
  color: player.color
});

export const game = (game: Game): Type.External.Game => ({
  _id: game._id,
  state: game.state,
  players: game.players.map(player)
});