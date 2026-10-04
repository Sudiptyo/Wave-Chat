"use client";

import { ChatsSectionData } from "@/constants/Chats/ChatsSection";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Chats = () => {
  const Icon = ChatsSectionData.header.icon;
  const SearchIcon = ChatsSectionData.search.icon;

  const pathname = usePathname();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  return (
    <main className="flex h-full w-full flex-col overflow-hidden rounded-2xl p-3 dark:bg-sidebar-primary-foreground">
      <div className="flex h-full flex-col py-4">
        {/* Header */}
        <header className="flex w-full items-center justify-between px-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs">{ChatsSectionData.header.heading}</span>

            <h1 className="mt-1 text-2xl">
              {ChatsSectionData.header.description}
            </h1>
          </div>

          <Icon size={20} />
        </header>

        {/* Search Bar */}
        <section className="relative mt-6 px-1">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder={ChatsSectionData.search.placeholder}
            className="pl-10"
          />
        </section>

        {/* Types */}
        <section className="mt-4 px-2.5">
          <div className="flex w-full items-center gap-1.5">
            {ChatsSectionData.messageTypes.map(({ id, type, href }) => {
              if (!href) return null;

              const isActive = pathname === href;

              return (
                <Link
                  key={id}
                  href={href}
                  className={`
                    rounded-full border px-3 py-1 text-xs
                    transition-colors duration-200
                    ${
                      isActive
                        ? "border-white bg-white text-slate-900"
                        : "border-border/70 bg-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  {type}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Chats */}
        <section className="mt-6 w-full px-3">
          <div className="flex flex-col gap-1">
            {ChatsSectionData.messages.map(
              ({ id, pfp, sender, message, timestamp }) => {
                const isSelected = selectedChat === id;

                return (
                  <div
                    key={id}
                    onClick={() => setSelectedChat(id)}
                    className={`
  flex w-full cursor-pointer items-center gap-3
  rounded-xl px-3 py-2.5
  transition-colors duration-200
  ${isSelected ? "border border-white/10 bg-white/8" : "hover:bg-white/5"}
`}
                  >
                    {/* PFP */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500">
                      {pfp}
                    </div>

                    {/* Chat Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="truncate text-sm font-semibold">
                          {sender}
                        </h2>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {timestamp}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {message}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Chats;
