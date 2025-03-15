/**
 * Déclarations globales pour l'application
 */

// Déclaration pour Platform global
interface Platform {
  OS: 'ios' | 'android' | 'web';
  select: <T>(obj: { ios?: T; android?: T; web?: T; default?: T }) => T;
}

declare global {
  var Platform: Platform;
}

export {}; 