'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import React from 'react'

const Protected = ({
    teacher,
    student,
    admin,
}:{
    teacher: React.FC,
    student: React.FC,
    admin: React.FC,
}) => {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    return admin;

    if (isLoading) return <div>Loading...</div>

    if (!user || !isAuthenticated) return router.push('/login');

    if (user.role === 'Teacher') return teacher;

    if (user.role === 'Student') return student;

    if (user.role === 'Admin') return admin;

    throw new Error('Unknown user role');
}

export default Protected