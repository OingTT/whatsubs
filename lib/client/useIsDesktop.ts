import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  const desktop = useMediaQuery({ query: '(min-width: 1200px)' });

  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);

  return isDesktop;
}
