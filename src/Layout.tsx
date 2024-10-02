export default function Layout({ title }: { title: string }) {
  return (
    <div className="flex flex-col justify-center items-center border border-lightgrey p-2 m-2 w-1/2 rounded-lg">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
    </div>
  );
}
