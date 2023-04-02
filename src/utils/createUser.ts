import { User } from '../models/userModel';

const createUser = async (payload: any) => {
  const user = await User.create({ email: 'test@test.com', ...payload });
  return JSON.parse(JSON.stringify(user));
};

export default createUser;
