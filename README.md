### There are 4 middleware:

- `requireLogin`: check if user is login
- `requireRole`: check if user is admin
- `checkIdExistene`: check if an objectid exists in a mongodb collection
- `globalErrorHandler`: express global error handler
- `routeNotFound`: simple prewritten function to handle route not found error

## requireLogin

In order to make this middleware work:

- you need to pass in User model created from express.Model as an arguement
- defined process.env.JWT_SECRET
- apply `cookie-parse` into express app

```javascript
router.use('/require-login', requireLogin(User), (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'pass the test' });
});
```

## requireRole

Require role simple check if req.user.role has a specific role.

```javascript
// in this example, it check if user has role of admin
router.use(
  '/require-role',
  requireLogin(User),
  requireRole('admin'),
  (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'pass the test' });
  },
);
```

It can also check if user has one of multiple roles

```javascript
// in this example, it check if user has role of admin
router.use(
  '/require-role',
  requireLogin(User),
  // it will pass if user is one of these 3 roles
  requireRole('admin', 'writer', 'support'),
  (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'pass the test' });
  },
);
```

## checkIdExistence

Check if all the object ids inside `req.body.friends` do exist.

`req.body.friends` can be a `single objectid` or `array of objectids.`

```javascript
router.use(
  '/check-id-existence',
  checkIdExistence(User, 'friends'),
  (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'pass the test' });
  },
);
```

It will throw error if `req.body.friends` contains an user id that does not exist.
You can check whatever field in whatever mongodb collection you want, not just `req.body.friends` fields in `user collection`.

## requireOwnership

This middleware accept mongoose model as an argument.
It will check if the document with `id = req.params.id` createdBy current login user.

**Behaviour**:

- return success if user have ownership to that doc
- return success if user is admin
- return error if user does not have ownership
- return error if document with id params does not exist
- return error if document does not contain createdBy field

**Important note:**

- the document that you checked ownership for need to have `createdBy` field contain creator userid
- you need to use `requireLogin` middleware before using `requireOwnership` because + `requireOwnership` need to use `req.user`
- The route you apply `requireOwnership` middleware must have `req.params.id`

## Global error handler

This middleware only handle jwt verify failure.
Otherwise, it just return generic message: `Something wentwrong!`

## Route not found

This is everything this middleware do!

```javascript
res.status(404).json({
  status: 'fail',
  message: 'This route is not defined',
});
```
