import request from 'supertest';
import { User } from '../../models/userModel';
import { app } from '../../config/app';

import jwt2Cookie from '../../utils/jwt2Cookie';
import signJwt from '../../utils/signJwt';
import createUser from '../../utils/createUser';

it('should return success message if user is an admin', async () => {
  const user = await createUser({
    isVerified: true,
    role: 'admin',
  });

  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  await request(app).get('/require-role').set('Cookie', cookie).expect(200);
});

it('should return error message if user is not an admin', async () => {
  const user = await createUser({
    isVerified: true,
    role: 'user',
  });

  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-role')
    .set('Cookie', cookie)
    .expect(403);

  expect(response.body.message).toEqual(
    'You do not have permission to perform this action',
  );
});
