import jwt from 'jsonwebtoken';

export function createTokenService({ secret, expiresIn }) {
  return {
    sign(user) {
      return jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });
    },

    verify(token) {
      const payload = jwt.verify(token, secret);
      return { id: payload.sub, role: payload.role };
    },
  };
}
