import { ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

describe('CreateCompanyDto', () => {
  it('trims values and accepts an optional formatted SIRET', async () => {
    const dto = plainToInstance(CreateCompanyDto, {
      name: '  Acme  ',
      siret: '123 456 789 01234',
      timezone: ' Europe/Paris ',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto).toMatchObject({
      name: 'Acme',
      siret: '12345678901234',
      timezone: 'Europe/Paris',
    });
  });

  it('rejects invalid company data', async () => {
    const dto = plainToInstance(CreateCompanyDto, {
      name: ' ',
      siret: '123',
      timezone: '',
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['name', 'siret', 'timezone']),
    );
  });

  it('rejects user and company identifiers supplied by the client', async () => {
    const pipe = new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    });

    await expect(
      pipe.transform(
        { name: 'Acme', userId: 'other-user', companyId: 'other-company' },
        { type: 'body', metatype: CreateCompanyDto, data: '' },
      ),
    ).rejects.toThrow();
  });
});
