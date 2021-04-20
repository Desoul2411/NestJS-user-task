import log from 'why-is-node-running';  
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
  let module: TestingModule;

  const dtoToCreate: CreateUserDataDto = {
    "userName":"Alexei",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "a0a52bd2ccdec6b3df056449b8f28e25"
  }

  const dtoToCreateSecondUser: CreateUserDataDto = {
    "userName":"Joe",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "050a6f1e9be0205ce58c457652196bc6"
  } 
  
  const dtoToUpdate: CreateUserDataDto = {
    /* "userId": 19, */
    "userName":"Joe",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "fd368b9850bcdbead71d7ae2baabfe77"
  }

  const dtoToUpdateAfterUserCreation: CreateUserDataDto = {
    /* "userId": 19, */
    "userName":"Joe",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "51a30f10fd11cee1727a9bf9bb768509"
  }

  const dtoToUpdateForUserNotFound: CreateUserDataDto = {
    "userName":"Joe",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "6efa00a55fde1ea28aae0e8eefe1cdf6"
  }


  const dtoWithNewName: CreateUserDataDto = {
    "userName":"Jack",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "e2f001694ea0c6e04880fdf8e60bd5c0"
  }

  const dtoWithIncorrectOldPassword: CreateUserDataDto = {
    "userName":"Jack",
    "userOldPassword":"weakPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "e77a87b3658b5391545d49ad8dc50364"
  }

  
  const invalidSignatureDTO: CreateUserDataDto = {
    "userName":"Joe",
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "82ef280c14ce9baa5e39a4b87bff797"
  }

  const invalidTypesCreateDTO = {
    "userName":32,
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "067c52a18c92126bd18ea1fc1ad40020"
  }
  
  const invalidTypesUpdateDTO = {
    "userName":33,
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "f284b60518d8d7c78ae461acf6e05cac"
  }

  const invalidCreateDTOWithoutProperty = {
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "345637758fe6e74931eb172f35ee714e"
  }

  const invalidUpdateDTOWithoutProperty = {
    "userOldPassword":"veryStrongPassword",
    "userNewPassword":"veryStrongPassword",
    "signature": "aaa21182333795370bd9d5b3293dd317"
  }
  
  const expectedCreatedUserBody = {
    "userNameHashed": "a6a73e1a9fd6a391c628c7ddae17acae5a79a2ebb6ea820c2c004de18ecc3cb7",
    "userPasswordEncrypted": "SnAzcW40MEJhaHhYSmxwVkoxRkh5TW9IQWhHK0ZuRlcyL284bHBxY3kxYz0tLTJGN3kwT3p0MUlaei9Ma2VnVS9hWVE9PQ==",
    "group": null,
    "id": 1
  }
  
  const expectedUpdatedUserBody = {
      "id": 1,
      "userNameHashed": "c46a79ca5792fbf3c68ce6bd1810200dfd8926e889fa375ce7efd9620dc5ac6f",
      "userPasswordEncrypted": "cGhnRmwwWC8zSzR4VEo3aU85cjlmWkJqUjl6ZytmSmIzWUcvVTI5ZGxvST0tLUc4T2pOa0EzZGZSKzZGMTlzM2JHb0E9PQ==",
      "group": 1
  }


  beforeAll(async (done) => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.get(Connection);
    await app.init();
    done();
  });

  //const repository = await getConnection().getRepository(entity.name);   UserOrmEntity // Get repository
  //await repository.clear(); // Clear each entity table's content

  it('/user (POST) - create - success', async (done) => {
    return await request(app.getHttpServer())
      .post('/user')
      .send(dtoToCreate)
      .expect(201)
      .then(({body}: request.Response) => {
        userId = body.id;
        expect(body.userNameHashed).toEqual(expectedCreatedUserBody.userNameHashed);
       // expect(body.userPasswordEncrypted).toEqual(expectedCreatedUserBody.userPasswordEncrypted);
        expect(body.group).toEqual(expectedCreatedUserBody.group);
        expect(body.id).toEqual(expectedCreatedUserBody.id);
        done();
      })
  });

  it('/user (POST) - create - fail (throw validation failed error when dto parameters have invalid type)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(invalidTypesCreateDTO)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
  });

  it('/user (POST) - create - fail (throw validation failed error when dto passed without required properties)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(invalidCreateDTOWithoutProperty)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
  });

  it('/user (POST) - fail (invalid signature)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send(invalidSignatureDTO)
      .expect(403, {
        statusCode: 403,
        message: "Forbidden resource",
        error: "Forbidden"
      });
  });

  ////////////////////////////////////

  it('/user (PUT) - update - success', async (done) => {
    return request(app.getHttpServer())
      .put(`/user/${userId}`)
      .send(dtoToUpdate)
      .expect(200)
      .then(({body}: request.Response) => {
        userId = body.id;
        expect(body.id).toEqual(expectedUpdatedUserBody.id);
        expect(body.userNameHashed).toEqual(expectedUpdatedUserBody.userNameHashed);
       // expect(body.userPasswordEncrypted).toEqual(expectedUpdatedUserBody.userPasswordEncrypted);
        expect(body.group).toEqual(expectedUpdatedUserBody.group);
        done();
      });
  });

  it('/user (PUT) - update - return updated user with group === 1 - success', async (done) => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send(dtoToUpdate)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.group).toEqual(1);
        done();
      });
  });

  it('/user (PUT) - update - return updated user with group === 2 - success', async (done) => {
    await request(app.getHttpServer())
      .post('/user')
      .send(dtoToCreateSecondUser)
      .expect(201)

    return request(app.getHttpServer())
      .put('/user/2')
      .send(dtoToUpdateAfterUserCreation)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.group).toEqual(2);
        done();
      });
  });

  it('/user (PUT) - update - return updated user with group === 3 - success', async (done) => {
    return request(app.getHttpServer())
      .put('/user/2')
      .send(dtoWithNewName)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.group).toEqual(3);
        done();
      });
  });

  it('/user (PUT)- update - fail (invalid signature)', () => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send(invalidSignatureDTO)
      .expect(403, {
        statusCode: 403,
        message: "Forbidden resource",
        error: "Forbidden"
      });
  });

  it('/user (PUT) - update - fail (user not found)',  () => {
    return request(app.getHttpServer())
      .put(`/user/35`)
      .send(dtoToUpdateForUserNotFound)
      .expect(404, {
        statusCode: 404,
        message: "No such user",
      });
      
  });

  it('/user (PUT) - update - fail (throw validation failed error when dto parameters have invalid type)', () => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send(invalidTypesUpdateDTO)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
  });


  it('/user (PUT) - update - fail  (throw validation failed error when dto passed without required properties)', () => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send(invalidUpdateDTOWithoutProperty)
      .expect(400, {
        statusCode: 400,
        message: "Validation failed",
        error: 'Bad Request'
      });
  });

  it('/user (PUT) - update - fail  (throw "Invalid old password!" if oldPassword is invalid)', () => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send(dtoWithIncorrectOldPassword)
      .expect(403, {
        statusCode: 403,
        message: "Invalid old password!",
      });
  });


  afterAll( async(done) => {
    await app.close()
    done()
  });
});