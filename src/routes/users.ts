import { Router } from 'express';
import auth from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.get('/details', auth, async (req, res) => {
  try {
    const candidate = await User.findById(req.body.user);

    if (!candidate) {
      res.status(400).json({ message: 'Not found!' });
    }

    res.status(200).json({
      id_type: candidate?.id_type,
      userId: candidate?._id,
      name: candidate?.username
    });
  } catch (e) {
    res.status(400).json({ message: 'Something go wrong!' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let candidates = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    ).then((data) => data.json());

    if (!candidates) {
      res.status(400).json({ message: 'Not found!' });
    }
    if (req.body.role === 'user' || req.body.role === 'admin') {
      candidates = candidates.filter((item: any, index: number) => {
        if (req.body.role === 'user' && index % 2 !== 0) {
          return false;
        }
        if (req.body.role === 'admin' && index % 2 !== 1) {
          return false;
        }
        return true;
      });
    }
    res.status(200).json(candidates);
  } catch (e) {
    res.status(400).json({ message: 'Something go wrong!' });
  }
});

export default router;
