import Link from "next/link";
import { usePathname } from "next/navigation";
export default function NavLink({
  myLinkHref,
  myLink,
}: {
  myLinkHref: string;
  myLink: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={myLinkHref}
      className={
        myLinkHref === pathname
          ? `active:text-foreground`
          : `transition-colors text-muted-foreground hover:text-foreground`
      }
    >
      {myLink}
    </Link>
  );
}
