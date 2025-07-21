'use client';
import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

export default function TopBar() {
  return (
    <header className="w-full bg-orange-300 shadow flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src={require('../assets/CAE_logo_2017_full.png')}
          alt="CAE Logo"
          width={236}
          height={68}
          className="mr-4"
        />
      </div>
      <ul className="flex items-center space-x-6 px-6 text-base font-medium text-gray-800">
        <li>{format(new Date(), 'MMMM dd, yyyy')}</li>
        <li>|</li>
        <li>Eric Clemens</li>
        <li>|</li>
        <li>Logout</li>
      </ul>
    </header>
  );
}