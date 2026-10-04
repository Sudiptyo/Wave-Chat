"use client";

import MessageSectionData from "@/constants/Chats/MessageSection";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CheckCheck, Send, SendHorizontal } from "lucide-react";
import useMediaPermissions from "../permission/Permission";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const Messages = () => {
  const isActive = true;
  const isSend = true;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState("");
  const [popOverOpen, setPopOverOpen] = useState(false);

  const showSendButton = value.length > 0;

  const {
    openCamera,
    openMicrophone,
    documentInputRef,
    mediaInputRef,
    openDocumentPicker,
    openMediaPicker,
    getLocation,
  } = useMediaPermissions();

  // Send message
  const handleSend = () => {
    if (!value.trim()) return;

    console.log("Sending message:", value);

    setValue("");
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;

    setValue(textarea.value);

    textarea.style.height = "auto";

    const maxHeight = 160;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  // Handle keyboard input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    // Tab / Space are allowed to make the send button appear
    // as long as the input contains something.
  };

  // Handle selected document
  const handleDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    console.log("Selected document:", file);
  };

  // Handle selected photos/videos
  const handleMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) return;

    console.log("Selected photos/videos:", Array.from(files));
  };

  return (
    <main className="flex size-full flex-col overflow-hidden rounded-2xl p-3 dark:bg-sidebar-primary-foreground">
      <div className="flex h-full flex-col py-4">
        {/* Hidden file inputs */}
        <input
          ref={documentInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          onChange={handleDocument}
        />

        <input
          ref={mediaInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={handleMedia}
        />

        {/* Header */}
        <header className="flex w-full items-center justify-between pl-12 pr-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {/* PFP */}
              <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-500 font-semibold text-white">
                {MessageSectionData.header.left.pfp}

                {isActive && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>

              <h1 className="text-lg font-semibold">
                {MessageSectionData.header.left.heading}
              </h1>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {MessageSectionData.header.right.map(
              ({ id, icon: Icon, hoverText }) => (
                <Tooltip key={id}>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={hoverText}
                      >
                        <Icon size={id === 3 ? 18 : 17} />
                      </button>
                    }
                  />

                  <TooltipContent>{hoverText}</TooltipContent>
                </Tooltip>
              ),
            )}
          </div>
        </header>

        {/* Separator */}
        <Separator className="mt-5 w-[calc(100%+24px)] bg-white/10" />

        {/* Body */}
        <main className="mt-8 w-full px-10">
          <div className="flex flex-col gap-3">
            {/* Received */}
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-t-2xl rounded-br-2xl bg-emerald-500/10 px-4 py-2.5">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                <span className="mt-2 block text-right text-[10px] text-muted-foreground">
                  2:11 am
                </span>
              </div>
            </div>

            {/* Sent */}
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-t-2xl rounded-bl-2xl bg-emerald-500/10 px-4 py-2.5">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                {isSend ? (
                  <div className="mt-2 flex items-center justify-end gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      2:11 am
                    </span>

                    <CheckCheck size={13} className="text-emerald-500" />
                  </div>
                ) : (
                  <span className="mt-2 block text-right text-[10px] text-muted-foreground">
                    2:11 am
                  </span>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto w-full px-4 py-2.5">
          <div className="relative w-full">
            {/* Message Input */}
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ resize: "none" }}
              placeholder={MessageSectionData.footer.searchBar.placeholder}
              className="min-h-12 max-h-40 w-full overflow-y-hidden rounded-xl py-3 pl-22 pr-22"
            />

            {/* Left Icons */}
            <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {MessageSectionData.footer.searchBar.attachment.left.map(
                ({ id, icon: Icon, hoverText }) => {
                  {
                    /* Attachment */
                  }
                  if (id === 2) {
                    return (
                      <Popover
                        key={id}
                        open={popOverOpen}
                        onOpenChange={setPopOverOpen}
                      >
                        <PopoverTrigger
                          render={
                            <button
                              type="button"
                              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label={hoverText}
                            >
                              <Icon size={17} />
                            </button>
                          }
                        />

                        <PopoverContent
                          side="top"
                          align="start"
                          alignOffset={-16}
                          sideOffset={20}
                          className="-translate-x-4 w-60 rounded-xl p-1.5"
                        >
                          <div className="flex flex-col gap-0.5">
                            {MessageSectionData.footer.popOverContent.map(
                              ({ id, icon: Icon, text }) => {
                                const handleClick = () => {
                                  switch (id) {
                                    // Document
                                    case 1:
                                      openDocumentPicker();
                                      break;

                                    // Photos & Videos
                                    case 2:
                                      openMediaPicker();
                                      break;

                                    // Camera
                                    case 3:
                                      openCamera();
                                      break;

                                    // Audio
                                    case 4:
                                      openMicrophone();
                                      break;

                                    // Contact
                                    case 5:
                                      console.log("Open contact picker");
                                      break;

                                    // Poll
                                    case 6:
                                      console.log("Open poll creator");
                                      break;

                                    // New sticker
                                    case 7:
                                      console.log("Open sticker picker");
                                      break;

                                    // Location
                                    case 8:
                                      getLocation();
                                      break;

                                    default:
                                      break;
                                  }

                                  // Close popover after selection
                                  setPopOverOpen(false);
                                };

                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={handleClick}
                                    className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors hover:bg-muted"
                                  >
                                    <Icon
                                      size={19}
                                      className={
                                        id === 1
                                          ? "text-violet-500"
                                          : id === 2
                                            ? "text-blue-500"
                                            : id === 3
                                              ? "text-pink-500"
                                              : id === 4
                                                ? "text-orange-500"
                                                : id === 5
                                                  ? "text-sky-500"
                                                  : id === 6
                                                    ? "text-yellow-500"
                                                    : id === 7
                                                      ? "text-emerald-500"
                                                      : "text-red-500"
                                      }
                                    />

                                    <span>{text}</span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  }

                  {
                    /* Sticker / Emoji */
                  }
                  return (
                    <Tooltip key={id}>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={hoverText}
                          >
                            <Icon size={17} />
                          </button>
                        }
                      />

                      <TooltipContent side="top">{hoverText}</TooltipContent>
                    </Tooltip>
                  );
                },
              )}
            </div>

            {/* Right Icons */}
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {MessageSectionData.footer.searchBar.attachment.right.map(
                ({ id, icon: Icon, hoverText }) => {
                  // Show Send instead of Microphone when there is input
                  if (id === 2) {
                    return (
                      <Tooltip key={id}>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              onClick={
                                showSendButton ? handleSend : openMicrophone
                              }
                              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label={
                                showSendButton ? "Send message" : hoverText
                              }
                            >
                              {showSendButton ? (
                                <SendHorizontal size={17} />
                              ) : (
                                <Icon size={17} />
                              )}
                            </button>
                          }
                        />

                        <TooltipContent side="top">
                          {showSendButton ? "Send message" : hoverText}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Tooltip key={id}>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            onClick={id === 1 ? openCamera : openMicrophone}
                            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={hoverText}
                          >
                            <Icon size={17} />
                          </button>
                        }
                      />

                      <TooltipContent side="top">{hoverText}</TooltipContent>
                    </Tooltip>
                  );
                },
              )}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Messages;
