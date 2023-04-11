import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function useIsMobile() {
  const [isMobile, setisMobile] = useState(true);
  const desktop = useMediaQuery({ query: "(max-width: 810px)" });

  useEffect(() => {
    setisMobile(desktop);
  }, [desktop]);

  return isMobile;
}
