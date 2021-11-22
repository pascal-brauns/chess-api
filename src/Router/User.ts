import express from 'express';
import * as DB from 'DB';

const router = express.Router();

router.post('/', async (req, res) => {
  const { nickname } = req.body;
  const user = await DB.User.create(nickname);
  res.json(user);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    res.end();
  }
  else {
    const user = await DB.User.get(id);
    if (user) {
      res.json(user);
    }
    else {
      res.status(404);
      res.end();
    }
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await DB.User.set(id, req.body);
    res.status(204);
    res.end();
  }
  catch(error) {
    res.status(404);
    res.end();
  }
});

export default router;