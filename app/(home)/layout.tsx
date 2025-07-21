import React from 'react';
import TopBar from '../components/TopBar';

export default function RootLayout(props: { children: React.ReactNode }) {

  return (
    <>
      <TopBar />
      {props.children}
    </>
  );
}