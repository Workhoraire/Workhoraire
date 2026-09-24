import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BillingOverview } from './billing.models';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);

  getOverview(): Observable<BillingOverview> {
    return this.http.get<BillingOverview>(`${environment.apiUrl}/billing`);
  }

  /** Stripe Checkout page, to subscribe to Essentiel. */
  createCheckout(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${environment.apiUrl}/billing/checkout`, {});
  }

  /** Stripe customer portal: invoices, payment method, cancellation. */
  createPortal(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${environment.apiUrl}/billing/portal`, {});
  }
}
