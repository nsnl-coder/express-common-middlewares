import request from 'supertest';
import createUser from '../../utils/createUser';
import { app } from '../../config/app';

describe('undefined id', () => {
  it('should return 200 if array of user is empty', async () => {
    const response = await request(app)
      .post('/check-id-existence')
      .send({
        friends: [],
      })
      .expect(200);
    expect(response.body.status).toEqual('success');
  });

  it('should return 200 if users is not defined', async () => {
    const response = await request(app)
      .post('/check-id-existence')
      .send({})
      .expect(200);

    expect(response.body.status).toEqual('success');
  });
});

describe('single id', () => {
  it('should return error if userid is not exist', async () => {
    const response = await request(app)
      .post('/check-id-existence')
      .send({
        friends: '507f191e810c19729de860ea',
      })
      .expect(404);

    expect(response.body.message).toEqual(
      'Can not find friends with provided id',
    );
  });

  it('should return 200 if userid does exist', async () => {
    const user = await createUser({});

    const response = await request(app)
      .post('/check-id-existence')
      .send({
        friends: user._id,
      })
      .expect(200);

    expect(response.body.status).toEqual('success');
  });
});

describe('array of ids', () => {
  it('should return error if userid is not exist', async () => {
    const response = await request(app)
      .post('/check-id-existence')
      .send({
        friends: ['507f191e810c19729de860ea', '00000020f51bb4362eee2a4d'],
      })
      .expect(404);

    expect(response.body.message).toEqual(
      'Can not find friends with provided ids',
    );
  });

  it('should return error if one user id in array of ids not exist', async () => {
    const user = await createUser({});

    const response = await request(app)
      .post('/check-id-existence')
      .send({
        friends: ['507f191e810c19729de860ea', user._id],
      })
      .expect(404);

    expect(response.body.message).toEqual(
      'Can not find friends with provided ids',
    );
  });

  it('should return 200 if array of user exist', async () => {
    const user1 = await createUser({ email: 'test1@test.com' });
    const user2 = await createUser({ email: 'test2@test.com' });
    const user3 = await createUser({ email: 'test3@test.com' });

    const response = await request(app)
      .post('/check-id-existence')
      .send({
        friends: [user1._id, user2._id, user3._id],
      })
      .expect(200);
    expect(response.body.status).toEqual('success');
  });
});
