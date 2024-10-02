export default function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center border border-lightgrey p-8 m-2 w-1/2 rounded-lg gap-6">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      {children}
    </div>
  );
}
