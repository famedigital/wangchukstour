import { getCompanyName } from '@/lib/brand';

export async function generateMetadata() {
  const name = await getCompanyName();
  return {
    title: `Admin Login | ${name}`,
    description: `Sign in to the ${name} admin dashboard`,
  };
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
