import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: any } };

    return (
        <>
            <Head title="MaMa Café" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2]">
                {auth?.user ? (
                    <Link href={dashboard()}>Dashboard</Link>
                ) : (
                    <Link href={login()}>Login</Link>
                )}
            </div>
        </>
    );
}
