import { ALERT_DESCRIPTIONS, describeAlert } from './labels';
import { ComplianceAlert, ComplianceAlertCode } from './time.models';

function alert(code: ComplianceAlertCode, value: number, limit: number): ComplianceAlert {
  return { code, date: '2026-10-05', scope: 'DAY', value, limit };
}

describe('compliance alert labels', () => {
  it('describes every alert code returned by the API', () => {
    for (const code of Object.keys(ALERT_DESCRIPTIONS) as ComplianceAlertCode[]) {
      const text = describeAlert(alert(code, 90, 60));
      expect(text).withContext(code).toContain(ALERT_DESCRIPTIONS[code].title);
      expect(text).withContext(code).not.toContain('undefined');
    }
  });

  it('shows the hours clocked during an approved absence', () => {
    expect(describeAlert(alert('WORK_DURING_ABSENCE', 210, 0))).toBe(
      'Heures pointées pendant une absence validée (3 h 30)',
    );
  });
});
