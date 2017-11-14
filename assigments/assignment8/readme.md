# Assignment 8

Users Node.JS API + views without persistance. API tests are included using supertest + Jest. UI tests are also included using chrome headless and puppetteer (All dependencies installed with npm i, no need to install extra drivers).

### Install dependencies
```sh
$ npm i
```

### Run server
```sh
$ npm start
```

### Run API tests
```sh
$ npm test
```

### Run End-to-end tests
```sh
$ npm run e2e
```
Bare in mind that this command automatically starts the server in the background. Therefore it will be required to manually stop the node process after testing is over:

```sh
$ ps -u <user> | grep node
$ kill -9 <node-pid>
```

This can be avoided by starting the server on a different terminal session beforehand.

