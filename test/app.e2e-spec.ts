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
  "signature": "3a54fc17e87520737253d899c9d4f90b"
}

describe('UsersController (e2e)', () => {
  let app: INestApplication;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.get(Connection);
    await app.init();
    
  });

  it('/user (POST) - check that response body is defined', async (done) => {
    return request(app.getHttpServer())
      .post('/user')
      .send(testDto)
      .expect(201)
      .then(({body}: request.Response) => {
        expect(body).toBeDefined();
        done();
      })
  });

  it('/user (PUT) - check that response body is defined', async (done) => {
    return request(app.getHttpServer())
      .put('/user')
      .send(testDto)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body).toBeDefined();
        done();
      })
  });
  

  afterEach( async() => {
    await app.close()
  });
});
