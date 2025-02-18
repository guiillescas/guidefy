'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => router.push('/')}
            className="font-space text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            guidefy
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Why guidefy', href: '#why-guidefy' },
              { label: 'Workflow', href: '#workflow' },
              { label: 'Get Started', href: '#get-started' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/login')}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started - $2.99/mo
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 
