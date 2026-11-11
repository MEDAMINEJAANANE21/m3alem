import { User } from '../models/user.model.js';

export const adminController = {
  async listUsers(_req, res) {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  },
};
