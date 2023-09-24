import { Person } from './interface';

export function getTmdbImagePath(path?: string, size: string = 'original') {
  return path && `https://image.tmdb.org/t/p/${size}${path}`;
}

export function isKorean(str: string) {
  const regExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return regExp.test(str);
}

export function getKoreanName(data: Person) {
  if (isKorean(data.name)) {
    return data.name;
  }
  const koreanName = data.also_known_as.find(name => isKorean(name));
  if (koreanName) {
    return koreanName;
  }

  return undefined;
}

export function getKoreanDepartment(department: string) {
  if (department === 'Acting') {
    return '배우';
  } else if (department === 'Directing') {
    return '감독';
  } else if (department === 'Production') {
    return '제작';
  } else if (department === 'Creator') {
    return '크리에이터';
  } else if (department === 'Writing') {
    return '작가';
  }
  return department;
}
