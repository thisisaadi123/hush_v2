import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { AppView } from '../App';

interface SignInProps {
  onSignIn: () => void;
  onNavigate: (view: AppView) => void;
  onSwitchToSignUp: () => void;
}

interface SignInFormData {
  username: string;
  password: string;
}

export function SignIn({ onSignIn, onNavigate, onSwitchToSignUp }: SignInProps) {
  const form = useForm<SignInFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    // Form validation is handled by react-hook-form rules
    // For now, just let them in (no backend)
    console.log('Sign in attempt:', data);
    onSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-[420px]">
        {/* Glassmorphism card */}
        <div className="glassmorphism-floating rounded-[24px] p-8 shadow-floating glassmorphism-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#5A5A52] mb-2">
              Welcome Back
            </h1>
            <p className="text-[16px] text-[#8B8B7E]">
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                rules={{
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5A5A52]">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        className="glassmorphism-input h-12 rounded-[12px] border-[#C8C8BC] text-[#5A5A52] placeholder:text-[#8B8B7E] focus:border-[#A8C5A7]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5A5A52]">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="glassmorphism-input h-12 rounded-[12px] border-[#C8C8BC] text-[#5A5A52] placeholder:text-[#8B8B7E] focus:border-[#A8C5A7]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 rounded-[12px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden group mt-8"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7A9A79] to-[#A8C5A7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-[#8B8B7E]">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-[#A8C5A7] hover:text-[#7A9A79] font-semibold transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-[14px] text-[#8B8B7E] hover:text-[#5A5A52] transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
