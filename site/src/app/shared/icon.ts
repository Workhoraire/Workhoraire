import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Stroke icons drawn on a 24 x 24 grid. They are always decorative. */
const ICONS = {
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  phone: [
    'M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2z',
    'M11 18.5h2',
  ],
  clock: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7.5V12l3 2'],
  history: ['M4 12a8 8 0 1 0 2.35-5.65', 'M4 4v4h4', 'M12 8v4l2.5 1.5'],
  alert: [
    'M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z',
    'M12 9.5v4',
    'M12 17h.01',
  ],
  percent: [
    'M19 5 5 19',
    'M7 5a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
    'M17 15a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
  ],
  download: [
    'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z',
    'M14 3v5h5',
    'M12 11v6',
    'M9 14l3 3 3-3',
  ],
  link: [
    'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1',
    'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  ],
  users: [
    'M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7z',
    'M2.5 20a6.5 6.5 0 0 1 13 0',
    'M16 4.2a3.5 3.5 0 0 1 0 6.6',
    'M18 14.5a6.5 6.5 0 0 1 3.5 5.5',
  ],
  briefcase: [
    'M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z',
    'M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
    'M3 13h18',
  ],
  pin: [
    'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z',
    'M12 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z',
  ],
  lock: [
    'M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z',
    'M8 11V7a4 4 0 0 1 8 0v4',
  ],
  eyeOff: [
    'M3 3l18 18',
    'M10.6 5.1A9.9 9.9 0 0 1 12 5c5 0 9 5 9 7c0 .8-.6 2-1.6 3.2',
    'M6.6 6.6C4.3 8 3 10.4 3 12c0 2 4 7 9 7c1.6 0 3.1-.5 4.4-1.3',
    'M9.9 9.9a3 3 0 0 0 4.2 4.2',
  ],
  document: [
    'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
    'M14 3v5h5',
    'M9 13h6',
    'M9 17h6',
  ],
  database: [
    'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3s-8-1.3-8-3s3.6-3 8-3z',
    'M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6',
    'M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  ],
} satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (path of paths(); track $index) {
        <path [attr.d]="path" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: 0 0 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);

  protected readonly paths = computed<readonly string[]>(() => ICONS[this.name()]);
}
