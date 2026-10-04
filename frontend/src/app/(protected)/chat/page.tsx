import Chats from "@/components/chat/Chats";
import Messages from "@/components/chat/Messages";
import Sidebar from "@/components/chat/SIdebar";

const Page = () => {
  return (
    <main className="grid h-dvh min-h-0 grid-cols-[80px_320px_1fr] gap-3 overflow-hidden p-3">
      <Sidebar />

      <section className="min-h-0 overflow-hidden rounded-2xl border">
        <Chats />
      </section>

      <section className="min-h-0 min-w-0 overflow-hidden rounded-2xl border">
        <Messages />
      </section>
    </main>
  );
};

export default Page;
