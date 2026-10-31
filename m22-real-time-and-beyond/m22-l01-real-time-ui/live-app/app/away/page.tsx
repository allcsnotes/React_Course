import Link from "next/link";

export default function Page() {
  return <div className="wrap"><span className="page">page: away</span><p><Link href="/leak">back to leak</Link> · <Link href="/clean">back to clean</Link></p></div>;
}
