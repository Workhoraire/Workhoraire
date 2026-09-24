import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { DownloadService } from './download.service';

describe('DownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('turns the JSON error sent as a Blob back into a readable API error', async () => {
    const service = TestBed.inject(DownloadService);
    const http = TestBed.inject(HttpTestingController);

    const failure = new Promise<HttpErrorResponse>((resolve) =>
      service.download('/exports/timesheets', 'export.csv', { from: '2026-09-01' }).subscribe({
        error: (error: HttpErrorResponse) => resolve(error),
      }),
    );
    http
      .expectOne(`${environment.apiUrl}/exports/timesheets?from=2026-09-01`)
      .flush(new Blob([JSON.stringify({ message: 'The period cannot exceed 62 days' })]), {
        status: 400,
        statusText: 'Bad Request',
      });

    const error = await failure;
    expect(error.status).toBe(400);
    expect(error.error.message).toBe('The period cannot exceed 62 days');
  });
});
