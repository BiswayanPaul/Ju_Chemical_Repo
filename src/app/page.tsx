"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Resource = {
  id: number;
  year: number;
  semester: number;
  subject: string;
  link: string;
};

const years = [1, 2, 3, 4];
const semesters = [1, 2];

const Home = () => {
  const [year, setYear] = useState<number | ''>('');
  const [semester, setSemester] = useState<number | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (year && semester) {
      fetch(`/api/resources?year=${year}&semester=${semester}`)
        .then((res) => res.json())
        .then((data: Resource[]) => {
          const uniq = Array.from(new Set(data.map((r) => r.subject)));
          setSubjects(uniq);
        });
    } else {
      setSubjects([]);
      setResources([]);
    }
  }, [year, semester]);

  useEffect(() => {
    if (year && semester && subject) {
      fetch(
        `/api/resources?year=${year}&semester=${semester}&subject=${encodeURIComponent(
          subject
        )}`
      )
        .then((res) => res.json())
        .then(setResources);
    } else {
      setResources([]);
    }
  }, [year, semester, subject]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header with title + Add button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          JU Chemical Engineering Resources
        </h1>
        <Link href="/add">
          <div className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow">
            + Add Resource
          </div>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          value={year}
          onChange={(e) => {
            setSubject('');
            setYear(Number(e.target.value) || '');
          }}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              Year {y}
            </option>
          ))}
        </select>

        <select
          value={semester}
          onChange={(e) => {
            setSubject('');
            setSemester(Number(e.target.value) || '');
          }}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s} value={s}>
              Sem {s}
            </option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={!subjects.length}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Resource List */}
      <div>
        {resources.length > 0 ? (
          <ul className="space-y-4">
            {resources.map((r) => (
              <li
                key={r.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow"
              >
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-green-600 hover:underline"
                >
                  {r.subject}
                </a>
                <p className="text-sm text-gray-500">
                  Year {r.year} • Sem {r.semester}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          subject && (
            <p className="text-center text-gray-600 mt-8">
              No resources found for that selection.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
