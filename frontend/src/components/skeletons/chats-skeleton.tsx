import { Skeleton } from "@/components/ui/skeleton";

const ChatsSkeleton = () => {
  return (
    <div className="flex size-full gap-3">
      {/* Chat list */}
      <div className="w-[340px] shrink-0 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="size-8 rounded-lg" />
        </div>

        <Skeleton className="mt-6 h-10 w-full rounded-xl" />

        <div className="mt-5 flex gap-2">
          <Skeleton className="h-7 w-12 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-11 shrink-0 rounded-xl" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>

              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-1 flex-col rounded-xl border">
        <div className="flex items-center gap-3 border-b p-5">
          <Skeleton className="size-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="space-y-6">
            <Skeleton className="h-14 w-[45%] rounded-2xl" />

            <Skeleton className="ml-auto h-14 w-[40%] rounded-2xl" />

            <Skeleton className="h-20 w-[50%] rounded-2xl" />

            <Skeleton className="ml-auto h-14 w-[35%] rounded-2xl" />
          </div>
        </div>

        <div className="p-4">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ChatsSkeleton;
