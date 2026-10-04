"use client";

import { SidebarSectionData } from "@/constants/Chats/SidebarSection";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import ThemeToggle from "../sidebar/theme-toggle";

const Sidebar = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <aside className="flex h-full w-20 shrink-0 flex-col border overflow-hidden rounded-2xl dark:bg-sidebar-primary-foreground">
      <div className="flex h-full flex-col items-center pt-5">
        {/* Header */}
        <header className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white">
          <span className="text-xl font-bold text-green-500">
            {SidebarSectionData.logo.text}
          </span>
        </header>

        {/* Body */}
        <div className="flex flex-col gap-3 pt-6">
          {SidebarSectionData.body.map(
            ({ id, icon: Icon, hoverText, href }) => {
              if (!href) return null;

              return (
                <Tooltip key={id}>
                  <TooltipTrigger
                    render={
                      <Link href={href} className="wc-icon-btn">
                        <Icon size={18} />
                      </Link>
                    }
                  />

                  <TooltipContent side="right">{hoverText}</TooltipContent>
                </Tooltip>
              );
            },
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto flex flex-col items-center gap-3 pb-5">
          {SidebarSectionData.footer.map(
            ({ id, href, icon: Icon, hoverText }) => {
              return (
                <div key={id}>
                  {/* Separator before token usage */}
                  {id === 3 && <Separator className="mb-3 w-10" />}

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        id === 1 ? (
                          <ThemeToggle />
                        ) : (
                          <Link href={href!} className="wc-icon-btn">
                            <Icon size={18} />
                          </Link>
                        )
                      }
                    />

                    <TooltipContent side="right">{hoverText}</TooltipContent>
                  </Tooltip>

                  {/* Token usage */}
                  {id === 3 && (
                    <div className="mt-1 text-center">
                      <p className="text-xs font-semibold">84 / 100</p>

                      <p className="text-[10px] text-muted-foreground mt-1">
                        tokens
                      </p>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </footer>
      </div>
    </aside>
  );
};

export default Sidebar;
