import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDataDto } from '../src/modules/user-web/dto/create-user-data.dto';
import { Connection, createConnection, getConnection } from 'typeorm';


const testDto: CreateUserDataDto = {
  /* "userId": 19, */
  "userName":"Joe",
  "userOldPassword":"veryStrongPassword",
  "userNewPassword":"veryStrongPassword",
  "signature": "82ef280c14ce9baa5e39a4b87bff7978"
}

const invalidSignatureDTO: CreateUserDataDto = {
  "userName":"Joe",
  "userOldPassword":"veryStrongPassword",
  "userNewPassword":"veryStrongPassword",
  "signature": "82ef280c14ce9baa5e39a4b87bff797"
}

const invalidTypesDTO = {
  "userName": 22,
  "userOldPassword":"veryStrongPassword",
  "userNewPassword":"veryStrongPassword",
  "signature": "82ef280c14ce9baa5e39a4b87bff7978"
}

const expectedUpdatedUserBody = {
    "id": 1,
    "userNameHashed": "c46a79ca5792fbf3c68ce6bd1810200dfd8926e889fa375ce7efd9620dc5ac6f",
    "userPasswordEncrypted": "cGhnRmwwWC8zSzR4VEo3aU85cjlmWkJqUjl6ZytmSmIzWUcvVTI5ZGxvST0tLUc4T2pOa0EzZGZSKzZGMTlzM2JHb0E9PQ==",
    "group": 1
}


describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: string;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.get(Connection);
    await app.init();
    
  });

/*   it('/user (POST) - fail (invalid signature)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(invalidSignatureDTO)
      .expect(403, {
        statusCode: 403,
        message: "Forbidden resource",
        error: "Forbidden"
      });
  }); */

  it('/user (POST) - create - success', async (done) => {
    return request(app.getHttpServer())
      .post('/user')
      .send(testDto)
      .expect(201)
      .then(({body}: request.Response) => {
        userId = body.id;
        expect(userId).toBeDefined();
        done();
      })
  });

  it('/user (POST) - create - fail (validation failed)', async () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(invalidTypesDTO)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
      
  });

  it('/user (PUT) - updateUser - success', async (done) => {
    return request(app.getHttpServer())
      .put(`/user/${userId}`)
      .send(testDto)
      .expect(200)
      .then(({body}: request.Response) => {
        userId = body.id;
        expect(body.id).toEqual(expectedUpdatedUserBody.id);
        expect(body.userNameHashed).toEqual(expectedUpdatedUserBody.userNameHashed);
        expect(body.userPasswordEncrypted).toEqual(expectedUpdatedUserBody.userPasswordEncrypted);
        expect(body.group).toEqual(expectedUpdatedUserBody.group);
        done();
      });
      
  });

  it('/user (PUT) - updateUser - fail (user not found)', async (done) => {
    return request(app.getHttpServer())
      .put(`/user/35`)
      .send(testDto)
      .expect(404, {
        statusCode: 404,
        message: "NO_SUCH_USER",
        error: 'Bad Request'
      });
      
  });

  it('/user (PUT) - update user - fail (validation failed)', () => {
    return request(app.getHttpServer())
      .put('/user')
      .send(testDto)
      .send(invalidTypesDTO)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
  });
  

  afterEach( async() => {
    await app.close()
  });
});