// import { TeacherProfile as TeacherProfileType } from '@/types/auth.types';
import TeacherProfileClientWrapper from '@/components/TeacherProfile/TeacherProfileClientWrapper';
// import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

// Server-side props
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // We can still generate metadata based on the ID
  const { id } = await params;
  return {
    title: `Teacher Profile - ${ id }`,
    description: 'View teacher profile and book lessons',
  };
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Pass the teacherId to the client component which will handle the data fetching
  return <TeacherProfileClientWrapper teacherId={ id } />;
}