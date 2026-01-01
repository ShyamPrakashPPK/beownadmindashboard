import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Gym Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create an account to get started
                    </p>
                </div>
                <div className="flex justify-center">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "shadow-2xl",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

