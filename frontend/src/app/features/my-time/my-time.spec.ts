import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NEVER, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TimeService } from '../../core/time/time.service';
import { CurrentUserService } from '../../core/user/current-user.service';
import { MyTime } from './my-time';

describe('MyTime', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [MyTime],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        {
          provide: CurrentUserService,
          useValue: { getCurrentUser: () => of({ company: { timezone: 'Europe/Paris' } }) },
        },
        // The week itself is not under test here.
        {
          provide: TimeService,
          useValue: { getMyTimesheet: () => NEVER, getMyAuditLogs: () => NEVER },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MyTime);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const downloadButton = () =>
      Array.from(element.querySelectorAll('button')).find((button) =>
        button.textContent?.includes('Télécharger mes données'),
      )!;
    return { fixture, element, downloadButton, http: TestBed.inject(HttpTestingController) };
  }

  it('downloads all my personal data as a JSON file', async () => {
    const { fixture, downloadButton, http } = await render();
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    spyOn(URL, 'createObjectURL').and.returnValue('blob:mes-donnees');

    downloadButton().click();
    fixture.detectChanges();
    expect(downloadButton().disabled).toBeTrue();

    const request = http.expectOne(`${environment.apiUrl}/me/data-export`);
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['{}'], { type: 'application/json' }));
    fixture.detectChanges();

    expect(click).toHaveBeenCalledTimes(1);
    const link = click.calls.mostRecent().object as HTMLAnchorElement;
    expect(link.download).toMatch(/^workhoraire-mes-donnees-\d{4}-\d{2}-\d{2}\.json$/);
    expect(downloadButton().disabled).toBeFalse();
  });

  it('explains a failed download', async () => {
    const { fixture, element, downloadButton, http } = await render();

    downloadButton().click();
    http
      .expectOne(`${environment.apiUrl}/me/data-export`)
      .flush(new Blob(), { status: 500, statusText: 'Server Error' });
    // The error body is read from the Blob asynchronously.
    for (let attempt = 0; attempt < 50 && !element.querySelector('[role="alert"]'); attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      fixture.detectChanges();
    }

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Vos données n’ont pas pu être téléchargées.',
    );
  });
});
