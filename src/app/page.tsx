"use client"

import { useState, useEffect } from 'react';

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
    }
  }, [year, semester]);

  useEffect(() => {
    if (year && semester && subject) {
      fetch(`/api/resources?year=${year}&semester=${semester}&subject=${encodeURIComponent(subject)}`)
        .then((res) => res.json())
        .then(setResources);
    }
  }, [year, semester, subject]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to JU Chemical Engineering Resources</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          value={year}
          onChange={(e) => { setSubject(''); setYear(Number(e.target.value) || ''); }}
          className="border p-2 rounded"
        >
          <option value="">Select Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={semester}
          onChange={(e) => { setSubject(''); setSemester(Number(e.target.value) || ''); }}
          className="border p-2 rounded"
        >
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 rounded"
          disabled={!subjects.length}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>

      <div>
        {resources.length ? (
          <ul className="space-y-2">
            {resources.map((r) => (
              <li key={r.id}>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {r.subject} (Year {r.year} Sem {r.semester})
                </a>
              </li>
            ))}
          </ul>
        ) : (
          subject && <p>No resources found for this combination.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
