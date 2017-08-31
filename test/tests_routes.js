process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);
const request = chai.request;

describe('app', function(){
  it('Should be an express app', function(){
    expect(app.EXPRESS_APP).to.be.true
  })
  it('Should render text at homepage', function(done){
    request(app)
    .get('/')
    .end((error, response) => {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    })
  })
  it('Should render text at login', function(done) {
    request(app)
    .get('/login')
    .end((error, response) => {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    })
  })
  it('Should render text at signup', function(done) {
    request(app)
    .get('/signup')
    .end((error, response) => {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    })
  })
  it('Should redirect if the forms are not filled out', function() {
    return request(app)
    .post('/signup')
    .field('email', 'a@a.com')
    .field('password', '')
    .field('confirmPassword', '')
    .then((result) => {
      // console.log(result.res.req.path)
      expect(result.res.req.path).to.eql('/signup/?err=err1')
    })
  })
  it('Should redirect if the password and confirmPassword forms do not match', function() {
    return request(app)
    .post('/signup')
    .set('content-type', 'application/x-www-form-urlencoded')
     .send({email: 'test',
          password: '12',
          confirmPassword: '123'
    })
    .then(function(result) {
      expect(result.redirects[0]).to.match(/\/signup\/\?err=err2$/)
    })
  })
})
