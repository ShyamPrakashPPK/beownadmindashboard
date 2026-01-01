'use client';

import { Sidebar } from './sidebar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <Sidebar />
            <main className="flex-1 lg:ml-64">
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

