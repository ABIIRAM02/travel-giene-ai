import Navbar from "@/components/navigation-bar";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="p-10" >
      <Navbar isDashboard={true} />
      {children}
    </div>
  );
};

export default layout;
