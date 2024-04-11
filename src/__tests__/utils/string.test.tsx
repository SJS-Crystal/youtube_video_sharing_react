import { trimString } from '../../utils/string';

describe('trimString', () => {
  test('should return the original string if it is shorter than the maxLength', () => {
    const str = 'Hello, World!';
    const maxLength = 15;

    const result = trimString(str, maxLength);

    expect(result).toBe(str);
  });

  test('should return the trimmed string with ellipsis if it is longer than the maxLength', () => {
    const str = 'This is a long string that needs to be trimmed';
    const maxLength = 20;

    const result = trimString(str, maxLength);

    expect(result).toBe('This is a long strin...');
  });

  test('should return an empty string if the input string is empty', () => {
    const str = '';
    const maxLength = 10;

    const result = trimString(str, maxLength);

    expect(result).toBe('');
  });
});
