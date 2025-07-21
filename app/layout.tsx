import React from "react";
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Class Acts Online v0.2.1 ',
    description: 'Online web portal for Class-Acts Entertainment',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}