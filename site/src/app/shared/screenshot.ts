import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A capture of the application, in a browser or phone frame. */
@Component({
  selector: 'app-screenshot',
  template: `
    <figure class="shot" [class.phone]="device() === 'phone'">
      <div class="frame">
        @if (device() === 'browser') {
          <div class="bar" aria-hidden="true"><span></span><span></span><span></span></div>
        }
        <img
          [attr.loading]="priority() ? 'eager' : 'lazy'"
          [attr.fetchpriority]="priority() ? 'high' : null"
          [attr.width]="width()"
          [attr.height]="height()"
          [src]="src()"
          [alt]="alt()"
          decoding="async"
        />
      </div>
      @if (caption(); as text) {
        <figcaption>{{ text }}</figcaption>
      }
    </figure>
  `,
  styles: `
    :host {
      display: block;
    }

    .shot {
      margin: 0;
    }

    .frame {
      overflow: hidden;
      border: 1px solid var(--wh-line);
      border-radius: 1rem;
      background: var(--wh-panel);
      box-shadow: var(--wh-shadow);
    }

    .bar {
      display: flex;
      gap: 0.35rem;
      padding: 0.55rem 0.8rem;
      border-bottom: 1px solid var(--wh-line);
      background: #fafbf7;

      span {
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 50%;
        background: var(--wh-line);
      }
    }

    img {
      width: 100%;
    }

    .phone .frame {
      border: 0.4rem solid var(--wh-ink);
      border-radius: 1.6rem;
    }

    figcaption {
      margin-top: 0.85rem;
      color: var(--wh-ink-soft);
      font-size: 0.92rem;
      line-height: 1.45;
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Screenshot {
  /** Path under `public/`, such as `/captures/pointer.png`. */
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  /** Intrinsic size of the image, to reserve its space before it loads. */
  readonly width = input.required<number>();
  readonly height = input.required<number>();
  readonly device = input<'browser' | 'phone'>('browser');
  readonly caption = input<string>();
  /** Loads the image immediately: only for the main image at the top of a page. */
  readonly priority = input(false);
}
