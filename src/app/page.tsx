import { HomeView } from "src/sections/home/view";

import { useEffect } from "react";

import { useRouter } from "src/routes/hooks";

import { PATH_AFTER_LOGIN } from "src/config-global";

// ----------------------------------------------------------------------
/*
export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push(PATH_AFTER_LOGIN);
  }, [router]);

  return null;
}
*/

export const metadata = {
  title: "SMEEYE",
};

export default function HomePage() {
  return <HomeView />;
}
