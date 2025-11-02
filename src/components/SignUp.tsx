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

interface SignUpProps {
  onSignUp: () => void;
  onNavigate: (view: AppView) => void;
  onSwitchToSignIn: () => void;
}

interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export function SignUp({ onSignUp, onNavigate, onSwitchToSignIn }: SignUpProps) {
  const form = useForm<SignUpFormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    // Form validation is handled by react-hook-form rules
    // Password matching is validated in the confirmPassword field rules
    // For now, just let them in (no backend)
    console.log('Sign up attempt:', { username: data.username });
    onSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-[420px]">
        {/* Glassmorphism card */}
        <div className="glassmorphism-floating rounded-[24px] p-8 shadow-floating glassmorphism-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#5A5A52] mb-2">
              Create Account
            </h1>
            <p className="text-[16px] text-[#8B8B7E]">
              Join HUSH and start your wellness journey
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
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
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
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) => {
                    const password = form.getValues('password');
                    if (value !== password) {
                      return 'Passwords do not match';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5A5A52]">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
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
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7A9A79] to-[#A8C5A7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-[#8B8B7E]">
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-[#A8C5A7] hover:text-[#7A9A79] font-semibold transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Sign In
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
