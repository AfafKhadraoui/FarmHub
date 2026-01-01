/*export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
    </div>
  );
}*/


// src/app/(auth)/register/page.tsx

import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return <RegisterForm />;
}

