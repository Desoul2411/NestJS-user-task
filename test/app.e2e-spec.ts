import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDataDto } from 'src/user/dto/create-user-data.dto';
import { Connection, createConnection, getConnection } from 'typeorm';


const testDto: CreateUserDataDto = {
  "userId": 19,
  "userName":"Joe",
  "userOldPassword":"veryStrongPassword",
  "userNewPassword":"veryStrongPassword",
  "signature": "82ef280c14ce9baa5e39a4b87bff7978"
}

const invalidSignatureDTO: CreateUserDataDto = {
  "userId": 19,
  "userName":"Joe",
  "userOldPassword":"veryStrongPassword",
  "userNewPassword":"veryStrongPassword",
  "signature": "82ef280c14ce9baa5e39a4b87bff797"
}

const invalidTypesDTO = {
  "userId": '19',
  "userName":"Joe",
  "userOldPassword":"veryStrongPassword",
  "userNewPassword":"veryStrongPassword",
  "signature": "82ef280c14ce9baa5e39a4b87bff7978"
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

  it('/user (POST) - create user - success', async (done) => {
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

  it('/user (POST) - create user - fail (validation failed)', async () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(invalidTypesDTO)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
      
  });

  it('/user (PUT) - update user - success', async (done) => {
    return request(app.getHttpServer())
      .put('/user')
      .send(testDto)
      .expect(200)
      .then(({body}: request.Response) => {
        userId = body.id;
        expect(userId).toBeDefined();
        done();
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
