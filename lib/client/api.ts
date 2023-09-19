export function getTmdbImagePath(path?: string, size: string = 'w500') {
  return path && `https://image.tmdb.org/t/p/${size}${path}`;
}
