
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const expectedApiKey = process.env.POST_API_SECRET;
    if (!expectedApiKey || request.headers.get('X-API-Key') !== expectedApiKey) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, excerpt, content } = await request.json();

    if (!title || !excerpt || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `${slug}.md`;
    const filePath = path.join(process.cwd(), 'posts', fileName);

    const markdownContent = `---
title: '${title}'
date: '${date}'
excerpt: '${excerpt}'
---

${content}
`;

    fs.writeFileSync(filePath, markdownContent);

    return NextResponse.json({ message: 'Post created successfully', slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
