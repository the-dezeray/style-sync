'use client';

import PixelBlast from '@/components/PixelBlast';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary-gradient">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#ffffff"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Top Right Login Button */}
      <div className="relative z-10 flex justify-end p-4 sm:p-6">
        <Button
          onClick={() => router.push('/login')}
          className="gap-2 bg-black/20 text-white backdrop-blur-sm hover:bg-black/35 border border-white/20 font-medium px-4 sm:px-5"
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          {/* Brand Name */}
          <h1
            className="mb-4 text-5xl font-black text-black sm:text-7xl md:text-9xl"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
          >
            STYLESYNC
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/90 sm:text-xl md:text-2xl">
            Modern Repair Management System
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 px-4 pb-8 text-center sm:px-6">
        <p className="text-sm text-white/80 sm:text-base">
          Streamline your repair operations with our comprehensive management platform.
          <br className="hidden sm:block" />
          Track inventory, manage repairs, process sales, and grow your business.
        </p>
      </div>
    </div>
  );
}
