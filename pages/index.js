import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Head>
        <title>Utility Aggregator Platform</title>
        <meta name="description" content="All your utilities in one place" />
        <link rel="icon" href="/cat.png" />
      </Head>

      <main className="w-full max-w-7xl">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">Utility Aggregator Platform</h1>
        
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/pdf-conversion">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">PDF Conversion</h2>
              <p className="text-gray-500">Convert your files to PDF format easily</p>
            </div>
          </Link>
          
          <Link href="/reminders">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Reminders</h2>
              <p className="text-gray-500">Set and manage your reminders</p>
            </div>
          </Link>
          
          <Link href="/alarms">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Alarms</h2>
              <p className="text-gray-500">Set alarms for important events</p>
            </div>
          </Link>
          
          <Link href="/just-breathe">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Just Breathe</h2>
              <p className="text-gray-500">Take a moment for mindfulness</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

