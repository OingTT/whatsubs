export function getTmdbImagePath(path?: string, size: string = 'original') {
  return path && `https://image.tmdb.org/t/p/${size}${path}`;
}
