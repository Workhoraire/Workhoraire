import { escapeCsvValue, formatDays, formatDecimalHours, toCsv } from './csv';

describe('CSV export helpers', () => {
  it('neutralises spreadsheet formulas injected through user-controlled text', () => {
    expect(escapeCsvValue('=HYPERLINK("http://evil")')).toBe('"\'=HYPERLINK(""http://evil"")"');
    expect(escapeCsvValue('+33600000000')).toBe("'+33600000000");
    expect(escapeCsvValue('-2')).toBe("'-2");
    expect(escapeCsvValue('@SUM(A1)')).toBe("'@SUM(A1)");
    expect(escapeCsvValue('Dupont')).toBe('Dupont');
  });

  it('quotes values containing separators, quotes or line breaks', () => {
    expect(escapeCsvValue('Martin; Jean')).toBe('"Martin; Jean"');
    expect(escapeCsvValue('Le "chef"')).toBe('"Le ""chef"""');
    expect(escapeCsvValue('ligne\nsuivante')).toBe('"ligne\nsuivante"');
  });

  it('builds a UTF-8 BOM, semicolon and CRLF file readable by French spreadsheets', () => {
    expect(toCsv([['Nom', 'Heures'], ['Dupont', '7,50']])).toBe('﻿Nom;Heures\r\nDupont;7,50\r\n');
  });

  it('formats hours and days with decimal commas', () => {
    expect(formatDecimalHours(450)).toBe('7,50');
    expect(formatDecimalHours(0)).toBe('0,00');
    expect(formatDecimalHours(2100)).toBe('35,00');
    expect(formatDays(1.5)).toBe('1,5');
  });
});
