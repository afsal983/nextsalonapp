



import { PublicAppointmentView } from "src/sections/publicappointment/view";


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

interface Params {
  id: string; // Define other parameters as needed
}
/*

export default async function PublicAppointment({
  params,
}: {
  params: Params;
}) {
  const { id } = params;

  // Query the database for the salon with the given id
  const [rows] = await pool.query(
    "SELECT * FROM pub_app_credentials WHERE bname = ?",
    [id]
  );

  console.log(rows);
  let username = "clientapp@XWTMpirFYQ.com";
  let password = "%6Fhrhff233";

  const data = {
    username,
    password,
  };

  console.log(data);
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_HOST_API}/api/login`,
    data
  );
  console.log(res.headers);
  return <HomeView />;
}

export default async function GET() {
  const res = NextResponse.next();

  // Set a cookie
  res.cookies.set("myCookie", "myValue", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return <HomeView />;
}
*/

export default function Message() {
  return <PublicAppointmentView />;
}
