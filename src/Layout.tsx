export default function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center border border-lightgrey py-4 md:py-8 px-8 m-2 rounded-lg gap-4 md:gap-6 md:w-1/2">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      {children}
    </div>
  );
}
