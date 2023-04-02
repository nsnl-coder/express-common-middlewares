import request from 'supertest';
import { User } from '../../models/userModel';
import { app } from '../../config/app';

it('return error instead of crashing the app', async () => {
  const response = await request(app).get('/global-error-handler').expect(400);
  expect(response.body.message).toEqual('something wentwrong');
});
