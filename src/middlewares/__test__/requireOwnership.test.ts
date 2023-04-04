import request from 'supertest';
import { app } from '../../config/app';
import { Post } from '../../models/postModel';
import mongoose from 'mongoose';

import jwt2Cookie from '../../utils/jwt2Cookie';
import signJwt from '../../utils/signJwt';
import createUser from '../../utils/createUser';
import { User } from '../../models/userModel';

it('should return success if user have ownership', async () => {
  const user = await createUser({
    isVerified: true,
  });
  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const post = await Post.create({
    content: 'test content',
    createdBy: user._id,
  });

  const response = await request(app)
    .delete(`/posts/${post._id}`)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.status).toEqual('success');
});

it('should return success if user is admin', async () => {
  const user = await User.create({
    isVerified: true,
    role: 'admin',
  });

  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const post = await Post.create({
    content: 'test content',
    createdBy: new mongoose.Types.ObjectId('642b8200fc13ae1d48f4cf1f'),
  });

  const response = await request(app)
    .delete(`/posts/${post._id}`)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.status).toEqual('success');
});

it('should return error if user does not have ownership', async () => {
  const user = await createUser({
    isVerified: true,
  });
  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const post = await Post.create({
    content: 'test content',
    createdBy: new mongoose.Types.ObjectId('642b8200fc13ae1d48f4cf1f'),
  });

  const response = await request(app)
    .delete(`/posts/${post._id}`)
    .set('Cookie', cookie)
    .expect(403);

  expect(response.body.message).toEqual(
    'You do not have permission to perform this action',
  );
});

it('should return error if document with id params does not exist', async () => {
  const user = await createUser({
    isVerified: true,
  });

  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const response = await request(app)
    .delete('/posts/642b8200fc13ae1d48f4cf21')
    .set('Cookie', cookie)
    .expect(404);

  expect(response.body.message).toEqual(
    'Can not find document with provided id params',
  );
});

it('should return error if document does not contain createdBy field', async () => {
  const user = await createUser({
    isVerified: true,
  });
  const jwt = signJwt(user._id);
  const cookie = jwt2Cookie(jwt);

  const post = await Post.create({ content: 'test content' });
  const response = await request(app)
    .delete(`/posts/${post._id}`)
    .set('Cookie', cookie)
    .expect(400);

  expect(response.body.message).toEqual(
    'Can not read createdBy field in the document! Did you pass in wrong model?',
  );
});
