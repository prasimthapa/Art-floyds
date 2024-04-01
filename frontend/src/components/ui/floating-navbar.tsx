"use client";
import React, { useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { AnimatedTooltip } from "./animated-tooltip";
import { IconForms, IconLogin, IconShoppingCart } from "@tabler/icons-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "./sheet";
import { Badge } from "./badge";
import { useCart } from "~/stores/cart";
import { groupBy } from "lodash";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { IconUser, IconDashboard, IconPaint, IconBrandDeliveroo } from "@tabler/icons-react";
import { KhaltiPaymentDialog } from "../khalti-payment-dialog";

const extra = {
  name: "Login",
  link: "/login",
  icon: (
    <IconLogin className="h-4 w-4 text-neutral-500 dark:text-white" />
  ),
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const session = useSession().data

  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);

  const currentPath = usePathname();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;

      if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit  fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full bg-transparent backdrop-brightness-75 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map(({ link, name, icon }, idx) => (
          <Link
            key={`link=${idx}`}
            href={link}
            className={cn(
              "relative border border-neutral-200 dark:border-white/[0.2] rounded-full px-4 py-2 dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{icon}</span>
            <span className="hidden sm:block text-sm">{name}</span>
            {currentPath === link && <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />}
          </Link>
        ))}
        <CartSheet />
        {
          !session?.user && <Link
            key={`link=extra`}
            href={extra.link}
            className={cn(
              "relative border border-neutral-200 dark:border-white/[0.2] rounded-full px-4 py-2 dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{extra.icon}</span>
            <span className="hidden sm:block text-sm">{extra.name}</span>
            {currentPath === extra.link && <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />}
          </Link>
        }
        {
          session?.user &&
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AnimatedTooltip items={[
                {
                  id: 1,
                  name: session.user.name ?? '',
                  designation: "",
                  image: session.user.image ?? '',
                },
              ]} />
            </DropdownMenuTrigger>
            <DropdownMenuContent hidden={session.user.role !== "artist"} align="end" className="mt-3 px-2 text-white shadow-xl bg-transparent backdrop-blur-md z-50">
              <DropdownMenuItem>
                <Link className="flex" href={`/profiles/${session.user.id}`}>
                  <IconUser className="w-5 h-5 mr-2" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link className="flex" href="/dashboard">
                  <IconDashboard className="w-5 h-5 mr-2" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link className="flex" href="/my-artworks">
                  <IconPaint className="w-5 h-5 mr-2" /> My Artworks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link className="flex" href="/forums">
                  <IconForms className="w-5 h-5 mr-2" /> Forums
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link className="flex" href="/orders">
                  <IconBrandDeliveroo className="w-5 h-5 mr-2" /> Orders
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </motion.div>
    </AnimatePresence>
  );
};

function CartSheet() {
  const cart = useCart()

  const items = useMemo(() => groupBy(cart.items, "artwork.id"), [cart.items]);

  return <Sheet>
    <SheetTrigger>
      <CartButton />
    </SheetTrigger>
    <SheetContent className="bg-black">
      <div className="flex flex-col space-y-4 p-4">
        {
          Object.entries(items).map(([id, items]) => {
            const { artwork } = items[0]!
            return <div className="flex items-center space-x-4" key={id}>
              <div className="relative h-16 w-16 overflow-hidden rounded">
                <Image
                  src={artwork?.image?.url ?? ''}
                  alt={artwork?.name ?? ''}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="absolute object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 self-start text-sm">
                <span className="line-clamp-1">{artwork?.name}</span>
                <span className="line-clamp-1 text-muted-foreground">
                  ${artwork?.price ?? 0} x {items.length} ={" "}
                  {(artwork?.price ?? 0) * items.length}
                </span>
                <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                  {artwork?.category}
                </span>
              </div>
            </div>
          })
        }
      </div>
      <SheetFooter>
        <KhaltiPaymentDialog total={cart.total}/>
      </SheetFooter>
    </SheetContent>
  </Sheet>
}

function CartButton() {
  const { count } = useCart()
  return <Button variant="ghost" className="relative">
    {count > 0 && (
      <Badge
        variant="secondary"
        className="absolute -right-2 -top-2 g-6 w-6 h-6 rounded-full p-2"
      >
        {count}
      </Badge>
    )}
    <IconShoppingCart />
  </Button>
}
