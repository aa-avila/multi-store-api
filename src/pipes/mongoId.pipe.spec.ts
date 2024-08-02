import { MongoIdValidation } from './mongoId.pipe';

describe('MongoId pipe', () => {
  let param: MongoIdValidation;

  beforeEach(async () => {
    param = new MongoIdValidation();
  });

  it('Check mongo id', () => {
    expect.assertions(1);
    expect(param.transform('6063412a54b46c00221fed3e')).toBe(
      '6063412a54b46c00221fed3e',
    );
  });

  it('Error - Check invalid mongo id', async () => {
    expect.assertions(1);
    try {
      param.transform('mongoid');
    } catch (error) {
      expect(error.response).toEqual({
        statusCode: 400,
        message: 'Bad Request',
      });
    }
  });
});
