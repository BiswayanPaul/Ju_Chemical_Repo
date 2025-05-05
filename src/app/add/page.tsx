"use client"

import { useState, FormEvent } from 'react';
import { useRouter } from "next/navigation";

const AddResource = () => {
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [subject, setSubject] = useState('');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: Number(year),
                    semester: Number(semester),
                    subject,
                    link,
                }),
            });
            // console.log('status', res.status);
            const text = await res.text();
            // console.log('body text:', text);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${text}`);
            }
            // const data = await res.json()
            // console.log({ data })
            // router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Resource</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600">{error}</p>}
                <input
                    type="number"
                    placeholder="Year (e.g. 1)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Semester (e.g. 2)"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="url"
                    placeholder="Link (https://...)"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddResource;
