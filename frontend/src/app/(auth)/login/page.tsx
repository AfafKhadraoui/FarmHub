/*export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}*/


// src/app/(auth)/login/page.tsx

import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}

