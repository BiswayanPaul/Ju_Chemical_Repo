
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from "@prisma/client"


export async function GET(request: Request) {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const semester = url.searchParams.get('semester');
    const subject = url.searchParams.get('subject');

    // Use the generated type instead of `any`
    const where: Prisma.ResourcesWhereInput = {};
    if (year) where.year = Number(year);
    if (semester) where.semester = Number(semester);
    if (subject) where.subject = subject;

    const resources = await prisma.resources.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(resources);
}


export async function POST(request: Request) {
    const { year, semester, subject, link } = await request.json();

    if (!year || !semester || !subject || !link) {
        return NextResponse.json(
            { error: 'All fields are required.' },
            { status: 400 }
        );
    }

    const newRes = await prisma.resources.create({
        data: { year, semester, subject, link },
    });

    return NextResponse.json(newRes, { status: 201 });
}
