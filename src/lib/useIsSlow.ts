import { useEffect, useState } from "react";

export type UseIsSlowProps = {
  isActive: boolean;
  ms?: number;
};

export default function useIsSlow({isActive,ms = 5000}: UseIsSlowProps): boolean {

  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {

    if (!isActive) {
      setIsSlow(false);
      return;
    }

    const mytimer = setTimeout(() => {
      setIsSlow(true);
    }, ms);

    return () => clearTimeout(mytimer);

  }, [isActive, ms]);

  return isActive && isSlow;
}