export function black(text) {
  return `\x1b[30m${text}\x1b[0m`;
}

export function red(text) {
  return `\x1b[31m${text}\x1b[0m`;
}

export function green(text) {
  return `\x1b[32m${text}\x1b[0m`;
}

export function yellow(text) {
  return `\x1b[33m${text}\x1b[0m`;
}

export function blue(text) {
  return `\x1b[34m${text}\x1b[0m`;
}

export function magenta(text) {
  return `\x1b[35m${text}\x1b[0m`;
}

export function cyan(text) {
  return `\x1b[36m${text}\x1b[0m`;
}

export function white(text) {
  return `\x1b[37m${text}\x1b[0m`;
}
