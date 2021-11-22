import express from 'express';
import * as DB from 'DB';
import IO from 'IO';
import _ from 'lodash';
import { Color, Turn, Type } from 'chess-processor';
import * as Pure from 'Pure';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const game = await DB.Game.get(req.params.id);
  if (game) {
    res.json(Pure.External.game(game));
  }
  else {
    res.status(404);
    res.end();
  }
});

router.get('/:id/player/:user/color', async (req, res) => {
  const game = await DB.Game.get(req.params.id);
  const color = (
    game?.players
      .find(player => player._id === req.params.user)
      ?.color
  );
  if (game && color) {
    res.json(color);
  }
  else {
    res.status(404);
    res.end();
  }
});

router.post('/:id/player/:user/action', async (req, res) => {
  const action = req.body as Type.Placement;
  const { id } = req.params;
  const user = await DB.User.get(req.params.user);
  const game = await DB.Game.get(id);
  const picks = Turn.picks(game.state.board, game.state.timeline);
  const allowed = picks.some(pick => (
    Turn.placements(game.state.board, game.state.timeline, pick)
      .some(placement => (
        placement.type === 'promotion' && action.type === 'promotion'
          ? _.isEqual(placement.move, action.move)
          : _.isEqual(placement, action)
      )) &&
    Color.turn(game.state.timeline) === (
      game.players.find(player => player._id === user._id)?.color
    )
  ));
  if (game && user && allowed) {
    const next = await DB.Game.dispatch(id, action);
    IO.emit(`${id}:game`, Pure.External.game(next));
    res.json(Pure.External.game(next));
  }
  else if (!user || !game) {
    res.status(404);
    res.end();
  }
  else if (!allowed) {
    res.status(401);
    res.end();
  }
})

export default router;