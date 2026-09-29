import DashboardNav from "@/components/dashboard/dashboard-nav";
import Sidebar from "@/components/side-bar/side-bar";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex" >
      <Sidebar/>
      <main className="flex-1 h-screen ml-[calc(100%/6)]" >
        <DashboardNav />
        <section className="p-8 mt-16" >
          {children}
        </section>
      </main>
    </div>
  );
};

export default layout;
