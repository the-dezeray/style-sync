'use client';

import PixelBlast from '@/components/PixelBlast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 z-0 bg-white">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#800080"
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

      {/* Top Left Login Button */}
      <div className="relative z-10 p-6">
        <Button
          onClick={() => router.push('/login')}
          className="bg-black text-white hover:bg-gray-800"
        >
          Login
        </Button>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          {/* Logo/Title */}
          <h1 className="mb-6 text-6xl font-bold text-black md:text-8xl">
            STYLESYNC
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-black/70 md:text-2xl">
            Modern Repair Management System
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 px-6 pb-8 text-center">
        <p className="text-sm text-black/60 md:text-base">
          Streamline your repair operations with our comprehensive management platform.
          <br />
          Track inventory, manage repairs, process sales, and grow your business.
        </p>
      </div>
    </div>
  );
}
