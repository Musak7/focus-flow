import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the Projects list, NOT the dashboard
  redirect('/projects');
  return null;
}