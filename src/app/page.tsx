


import { HomeView } from "src/sections/home/view";

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
