import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDataDto } from '../src/modules/user-web/dto/create-user-data.dto';
import { UserOrmEntity } from '../src/modules/user-persistence/user.orm.entity';
import { Connection, createConnection, getConnection } from 'typeorm';


describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: string;


  const dtoToCreate: CreateUserDataDto = {
    "userName":"334324fdsfghgfhgfhfghgfhrtyyrgfffds",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "82ef280c14ce9baa5e39a4b87bff7978"
  }
  
  const dtoToUpdate: CreateUserDataDto = {
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
  
  const expectedCreatedUserBody = {
    "userNameHashed": "5cd69dee1535a2aa45bf7211b539a80ea03b873cae1ce8f028435eaaeeb53426",
    "userPasswordEncrypted": "Vk8yRkhINHNBdWpqWmo2bzhHNGZHK1lzVUdpLzAxVE5zU1BQeEhScmljOD0tLVNTb0c0VkRGSmMyM1ZHNittejFLQ1E9PQ==",
    "group": null,
    "id": 1
  }
  
  const expectedUpdatedUserBody = {
      "id": 1,
      "userNameHashed": "c46a79ca5792fbf3c68ce6bd1810200dfd8926e889fa375ce7efd9620dc5ac6f",
      "userPasswordEncrypted": "cGhnRmwwWC8zSzR4VEo3aU85cjlmWkJqUjl6ZytmSmIzWUcvVTI5ZGxvST0tLUc4T2pOa0EzZGZSKzZGMTlzM2JHb0E9PQ==",
      "group": 1
  }


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.get(Connection);
    await app.init();
    
  });

  //const repository = await getConnection().getRepository(entity.name);   UserOrmEntity // Get repository
  //await repository.clear(); // Clear each entity table's content

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
      .send(dtoToCreate)
      .expect(201)
      .then(({body}: request.Response) => {
        userId = body.id;
        expect(body.userNameHashed).toEqual(expectedCreatedUserBody.userNameHashed);
        expect(body.userPasswordEncrypted).toEqual(expectedCreatedUserBody.userPasswordEncrypted);
        expect(body.group).toEqual(expectedCreatedUserBody.group);
        expect(body.id).toEqual(expectedCreatedUserBody.id);
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
      .send(dtoToUpdate)
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
      .send(dtoToUpdate)
      .expect(404, {
        statusCode: 404,
        message: "NO_SUCH_USER",
        error: 'Bad Request'
      });
      
  });

  it('/user (PUT) - update user - fail (validation failed)', () => {
    return request(app.getHttpServer())
      .put('/user')
      .send(dtoToUpdate)
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