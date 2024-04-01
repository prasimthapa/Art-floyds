import "~/styles/globals.css";

import { FloatingNav } from "~/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser, IconBrandWish } from "@tabler/icons-react";
import { CartItemProvider } from "./_providers/cart-item-provider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartItemProvider>
      <div className="relative w-full">
        <FloatingNav navItems={navItems} />
        {children}
      </div>
    </CartItemProvider>
  );
}

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Artworks",
    link: "/browse-artwork",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "For You",
    link: "/feed",
    icon: (
      <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
  {
    name: "Wishlist",
    link: "/wishlist",
    icon: (
      <IconBrandWish className="h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
];
