import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmployeesService } from './employees.service';

@Injectable()
export class ContractRefreshJob {
  constructor(private readonly employees: EmployeesService) {}

  /**
   * Every hour: a contract change planned for a later week shows up soon
   * after the Monday midnight of the company timezone.
   */
  @Cron('1 * * * *', { name: 'contract-refresh' })
  async refresh(): Promise<void> {
    await this.employees.refreshCurrentContracts();
  }
}
