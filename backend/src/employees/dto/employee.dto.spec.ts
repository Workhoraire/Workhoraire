import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from '@prisma/client';
import { CreateEmployeeInvitationDto } from './create-employee-invitation.dto';
import { UpdateEmployeeDto } from './update-employee.dto';

describe('Employee DTOs', () => {
  it('normalizes a valid invitation payload', async () => {
    const dto = plainToInstance(CreateEmployeeInvitationDto, {
      firstName: ' Jean ',
      lastName: ' Dupont ',
      email: ' EMPLOYEE@EXAMPLE.COM ',
      role: UserRole.MANAGER,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto).toMatchObject({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'employee@example.com',
      role: UserRole.MANAGER,
    });
  });

  it('rejects invalid invitation and update values', async () => {
    const invitation = plainToInstance(CreateEmployeeInvitationDto, {
      firstName: '',
      lastName: '',
      email: 'not-an-email',
      role: 'OWNER',
    });
    const update = plainToInstance(UpdateEmployeeDto, {
      role: 'OWNER',
      isActive: 'false',
    });

    expect(await validate(invitation)).not.toHaveLength(0);
    expect(await validate(update)).not.toHaveLength(0);
  });

  it('bounds the contractual weekly time between 1 and 48 hours', async () => {
    const valid = plainToInstance(UpdateEmployeeDto, { weeklyContractMinutes: 1440 });
    const tooLow = plainToInstance(UpdateEmployeeDto, { weeklyContractMinutes: 30 });
    const tooHigh = plainToInstance(CreateEmployeeInvitationDto, {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      weeklyContractMinutes: 3000,
    });

    expect(await validate(valid)).toHaveLength(0);
    expect(await validate(tooLow)).not.toHaveLength(0);
    expect(await validate(tooHigh)).not.toHaveLength(0);
  });
  it('refuses web addresses in names, which are copied into e-mails', async () => {
    const invitation = plainToInstance(CreateEmployeeInvitationDto, {
      firstName: 'Jean',
      lastName: 'https://evil.example',
      email: 'jean@example.com',
    });
    const update = plainToInstance(UpdateEmployeeDto, { firstName: 'www.evil.example' });

    expect((await validate(invitation)).map((error) => error.property)).toEqual(['lastName']);
    expect((await validate(update)).map((error) => error.property)).toEqual(['firstName']);
    expect(await validate(plainToInstance(UpdateEmployeeDto, { firstName: 'Jean-Pierre' }))).toHaveLength(0);
  });
});
