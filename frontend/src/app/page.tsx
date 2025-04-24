import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to Mini-CRM</h1>
        <p className="mt-4 text-lg text-gray-600">
          Please log in to access your dashboard
        </p>
      </div>
    </main>
  );
}
