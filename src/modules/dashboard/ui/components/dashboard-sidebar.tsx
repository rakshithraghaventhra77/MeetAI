"use client";

import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BotIcon, VideoIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image href="/logo.svg" height={36} width={36} alt="Meet.AI" />
        </Link>
      </SidebarHeader>
    </Sidebar>
  );
};
