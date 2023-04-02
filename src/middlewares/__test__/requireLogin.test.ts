import request from 'supertest';
import { User } from '../../models/userModel';
import { app } from '../../config/app';

import jwt2Cookie from '../../utils/jwt2Cookie';
import signJwt from '../../utils/signJwt';
import createUser from '../../utils/createUser';

it('should return error if user is not logged in', async () => {
  const response = await request(app)
    .get('/require-login')
    .set('Cookie', '')
    .expect(401);
  expect(response.body.message).toEqual(
    'You are not logged in! Please logged in to perform the action',
  );
});

it('should return error if user is not verified', async () => {
  const user = await createUser({
    isVerified: false,
  });
  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(401);

  expect(response.body.message).toEqual(
    'Please verified your email to complete this action!',
  );
});

it('should return error if token is expired', async () => {
  const user = await createUser({
    isVerified: true,
  });

  const jwt = signJwt(user._id, { expiresIn: -10000 });
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(400);

  expect(response.body.message).toEqual('jwt expired');
});

it('should return error if token is not a valid token', async () => {
  const jwt = 'some-random-jwt';
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(400);

  expect(response.body.message).toEqual('jwt malformed');
});

it('should return error if encoded user id is not a valid id', async () => {
  const jwt = signJwt('invalid-user-id');
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(400);

  expect(response.body.message).toEqual(
    'Cast to ObjectId failed for value "invalid-user-id" (type string) at path "_id" for model "UserModel"',
  );
});

it('should return error if encoded user id does not exist', async () => {
  const jwt = signJwt('507f191e810c19729de860ea');
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(404);

  expect(response.body.message).toEqual(
    'Cant find an user belongs to provided token',
  );
});

it('should return error if password recently changed', async () => {
  const user = await createUser({
    isVerified: true,
  });

  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(200);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      passwordChangedAt: Date.now() + 5000,
    },
    { new: true },
  );

  const { body } = await request(app)
    .get('/require-login')
    .set('Cookie', cookie)
    .expect(400);

  expect(body.message).toEqual(
    'You recently changed password, please login again!',
  );
});
