import { ValidationOptions, registerDecorator } from 'class-validator';

/** "https://…", "www.…", an e-mail address, a path. */
const WEB_ADDRESS = /:\/\/|\bwww\.|[@/\\]/i;

/** A domain name that mail clients turn into a link, such as "paie-rh.fr". */
const DOMAIN_NAME =
  /[\p{L}\p{N}-]\.(?:fr|com|net|org|io|co|eu|info|biz|be|ch|de|uk|us|app|dev|site|online|shop|xyz|me|link|click)(?![\p{L}\p{N}])/iu;

function containsWebAddress(value: string): boolean {
  return WEB_ADDRESS.test(value) || DOMAIN_NAME.test(value);
}

/**
 * Refuses names containing a web address. Names are copied into e-mails
 * (invitations, corrections): they must not turn them into phishing links.
 */
export function NoWebAddress(options?: ValidationOptions): PropertyDecorator {
  return (target: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'noWebAddress',
      target: target.constructor,
      propertyName: propertyName as string,
      options: { message: `${String(propertyName)} cannot contain a web address`, ...options },
      validator: {
        validate: (value: unknown) => typeof value !== 'string' || !containsWebAddress(value),
      },
    });
  };
}
