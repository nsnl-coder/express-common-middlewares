import jwt from 'jsonwebtoken';

const signJwt = (id: string, options?: any) => {
  // @ts-expect-error
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
    ...options,
  });
};

export default signJwt;
