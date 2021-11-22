import express from 'express';
import * as DB from 'DB';
import IO from 'IO';
import * as Type from 'Type';
import * as Pure from 'Pure';

const router = express.Router();

router.post('/', async (req, res) => {
  const user = await DB.User.get(req.body._id);
  if (user) {
    const lobby = await DB.Lobby.create(user);
    IO.emit(
      'lobbies', 
      (await DB.Lobby.all()).map(Pure.External.lobby)
    );
    IO.emit(`${lobby._id}:lobby`, Pure.External.lobby(lobby));
    res.json(Pure.External.lobby(lobby));
  }
  else {
    res.status(404);
    res.end();
  }
});

router.get('/', async (_, res) => res.json(
  (await DB.Lobby.all())
    .map(Pure.External.lobby)
));

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lobby = await DB.Lobby.get(id);
  if (lobby) {
    res.json(Pure.External.lobby(lobby));
  }
  else {
    res.status(404);
    res.end();
  }
});

router.get('/:id/members/:user/color', async (req, res) => {
  const { id } = req.params;
  const user = await DB.User.get(req.params.user);
  if (user) {
    const color = await DB.Lobby.getColor(user, id);
    res.json(color);
  }
  else {
    res.status(404);
    res.end();
  }
});

router.post('/:id/members/:user/join', async (req, res) => {
  const { id } = req.params;
  const lobby = await DB.Lobby.get(id);
  const user = await DB.User.get(req.params.user);

  if (lobby && user) {
    await DB.Lobby.join(user, id);
    IO.emit(`${id}:lobby`, Pure.External.lobby(await DB.Lobby.get(id)));
    res.status(204);
    res.end();
  }
  else {
    res.status(404);
    res.end();
  }
});

router.delete('/:id/members/:user/leave', async (req, res) => {
  const { id } = req.params;
  const lobby = await DB.Lobby.get(id);
  const user = await DB.User.get(req.params.user);
  if (lobby && user) {
    const lobby = await DB.Lobby.leave(user, id);
    if (lobby) {
      IO.emit(`${id}:lobby`, Pure.External.lobby(await DB.Lobby.get(id)));
    }
    else {
      IO.emit('lobbies', (await DB.Lobby.all()).map(Pure.External.lobby));
    }
    res.status(204);
    res.end();
  }
  else {
    res.status(404);
    res.end();
  }
});

router.put('/:id/members/:user/color/:color', async (req, res) => {
  const lobby = () => DB.Lobby.get(req.params.id);
  const user = await DB.User.get(req.params.user);
  const valid = ['black', 'white'].includes(req.params.color);
  if (await lobby() && user && valid) {
    await DB.Lobby.selectColor(
      user,
      req.params.id,
      req.params.color as Type.Chess.Color
    );
    IO.emit(`${req.params.id}:lobby`, Pure.External.lobby(await lobby()));
    res.status(204);
    res.end();
  }
  else if (!valid) {
    res.status(400);
    res.end();
  }
  else {
    res.status(404);
    res.end()
  }
});

router.put('/:id/members/:user/ready', async (req, res) => {
  const { id } = req.params;
  const lobby = await DB.Lobby.get(req.params.id);
  const user = await DB.User.get(req.params.user);

  if (lobby && user) {
    await DB.Lobby.toggleReady(user, id);
    const lobby = await DB.Lobby.get(id);
    IO.emit(`${id}:lobby`, Pure.External.lobby(lobby));
    if (lobby.members.length === 2 && lobby.members.every(member => member.ready)) {
      const game = await DB.Game.create(lobby);
      IO.emit(`${game._id}:game`, Pure.External.game(game));
      await DB.Lobby.remove(lobby._id);
    }
    res.status(204);
    res.end();
  }
  else {
    res.status(404);
    res.end();
  }
});

export default router;