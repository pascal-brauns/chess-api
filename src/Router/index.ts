import express from 'express';
import User from './User';
import Lobby from './Lobby';
import Game from './Game';

const router = express.Router();

router.use('/users', User);
router.use('/lobbies', Lobby);
router.use('/games', Game);

export default router;