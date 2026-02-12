import { validate } from '@/validator';
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

router.post('/validate', (req: Request, res: Response, next: NextFunction) => {
  // Add your validation logic here
  const issue = req.body.issue;
  const bonus = req.body.bonus;
  const freeGamesWinnings = req.body.freeGamesWinnings ?? null;

  if (!issue || !bonus) return res.status(400).send("Missing issue or bonus");

  return res.send(validate({issue, bonus, freeGamesWinnings}))
});

export default router;
