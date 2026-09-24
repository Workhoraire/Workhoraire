import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

/** Downloads files from the API (CSV exports, personal data) and saves them with a chosen name. */
@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly http = inject(HttpClient);

  download(path: string, fileName: string, params: Record<string, string> = {}): Observable<void> {
    return this.http.get(`${environment.apiUrl}${path}`, { params, responseType: 'blob' }).pipe(
      map((blob) => saveBlob(blob, fileName)),
      catchError((response: HttpErrorResponse) =>
        from(parseBlobError(response)).pipe(switchMap((parsed) => throwError(() => parsed))),
      ),
    );
  }
}

function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  // Some browsers start the download asynchronously: keep the file available a moment.
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** With a Blob response type, API errors arrive as a Blob too: read the JSON message. */
async function parseBlobError(response: HttpErrorResponse): Promise<HttpErrorResponse> {
  if (!(response.error instanceof Blob)) {
    return response;
  }
  try {
    return new HttpErrorResponse({
      error: JSON.parse(await response.error.text()),
      status: response.status,
      statusText: response.statusText,
      url: response.url ?? undefined,
    });
  } catch {
    return response;
  }
}
