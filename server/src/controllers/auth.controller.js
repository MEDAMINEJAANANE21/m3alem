import { ApiError } from '../errors/api-error.js';
import { User } from '../models/user.model.js';

export function createAuthController(tokenService) {
  const buildSession = (user) => ({ token: tokenService.sign(user), user });

  return {
    async register(req, res) {
      const { name, email, password, phone, role } = req.validated;

      if (await User.exists({ email })) {
        throw ApiError.conflict('Un compte existe déjà avec cet e-mail');
      }

      const user = await User.create({ name, email, password, phone, role });
      res.status(201).json(buildSession(user));
    },

    async login(req, res) {
      const { email, password } = req.validated;
      const user = await User.findOne({ email }).select('+password');

      // Same message for unknown e-mail and wrong password, to avoid leaking which accounts exist.
      if (!user || !(await user.comparePassword(password))) {
        throw ApiError.unauthorized('Identifiants invalides');
      }

      res.json(buildSession(user));
    },

    async me(req, res) {
      const user = await User.findById(req.user.id);
      if (!user) throw ApiError.notFound('Utilisateur introuvable');
      res.json({ user });
    },
  };
}
