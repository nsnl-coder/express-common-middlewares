const jwt2Cookie = (jwt: string) => {
  return [`jwt=${jwt}; Path=/; HttpOnly`];
};

export default jwt2Cookie;
