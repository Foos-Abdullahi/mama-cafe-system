import { Form, Head } from '@inertiajs/react';
import { User, Lock, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="MaMa Café Portal - Sign In" />

            <PasskeyVerify />

            {status && (
                <div className="mb-5 rounded-lg bg-amber-50 p-3 text-center text-xs font-medium text-amber-800 border border-amber-200">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5 w-full"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* USERNAME FIELD */}
                            <div className="grid gap-1.5 text-left w-full">
                                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B49]">
                                    USERNAME
                                </Label>
                                <div className="relative w-full">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7E6E] z-10 pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Enter your username"
                                        className="pl-10 pr-4 py-2.5 h-11 bg-[#F5F0E8] border border-[#E0D5C5] focus:border-[#7A3E22] focus:ring-1 focus:ring-[#7A3E22] text-[#4A3225] placeholder:text-[#B5A499] rounded-lg text-sm transition-all w-full"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* PASSWORD FIELD */}
                            <div className="grid gap-1.5 text-left w-full">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B49]">
                                        PASSWORD
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-semibold text-[#7A3E22] hover:text-[#58250F] underline-offset-4 hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot Password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative w-full">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7E6E] z-10 pointer-events-none" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10 py-2.5 h-11 bg-[#F5F0E8] border border-[#E0D5C5] focus:border-[#7A3E22] focus:ring-1 focus:ring-[#7A3E22] text-[#4A3225] placeholder:text-[#B5A499] rounded-lg text-sm transition-all w-full"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* REMEMBER ME OPTION */}
                            <div className="flex items-center space-x-2.5 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-[#D4C5B3] data-[state=checked]:bg-[#7A3E22] data-[state=checked]:border-[#7A3E22]"
                                />
                                <Label htmlFor="remember" className="text-xs font-medium text-[#7A5B49] cursor-pointer">
                                    Remember me
                                </Label>
                            </div>

                            {/* SIGN IN BUTTON */}
                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="w-full mt-3 h-11 bg-[#7A3E22] hover:bg-[#612F18] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] border-none cursor-pointer"
                            >
                                {processing ? (
                                    <Spinner className="w-4 h-4 text-white" />
                                ) : (
                                    <>
                                        SIGN IN <ArrowRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* AUTHORIZED PERSONNEL DIVIDER */}
                        <div className="relative w-full my-6 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#E6DCD0]" />
                            </div>
                            <span className="relative bg-[#F5F0E8] px-3.5 text-[11px] font-medium text-[#A38B7C] tracking-wide uppercase">
                                Authorized Personnel Only
                            </span>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'MaMa Café Portal',
    description: 'Please sign in to access the admin panel.',
};
