import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, CheckCircle, Calendar, Plus, X } from 'lucide-react';
import { StudentRecord } from '../types';

interface TeacherDashboardProps {
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onClose }) => {
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 'st_1',
      name: 'Zaid Khan',
      avatarColor: 'bg-blue-500',
      completedLessons: 6,
      accuracy: 94,
      timeSpentMinutes: 140,
      lastActive: 'Today',
      attendance: { '2026-07-24': true },
      notes: 'Excellent pronunciation of Makhraj throat letters.',
    },
    {
      id: 'st_2',
      name: 'Ayesha Fatima',
      avatarColor: 'bg-rose-500',
      completedLessons: 9,
      accuracy: 98,
      timeSpentMinutes: 210,
      lastActive: 'Today',
      attendance: { '2026-07-24': true },
      notes: 'Madd & Long vowels completed with 3 stars.',
    },
    {
      id: 'st_3',
      name: 'Omar Farooq',
      avatarColor: 'bg-emerald-500',
      completedLessons: 4,
      accuracy: 82,
      timeSpentMinutes: 95,
      lastActive: 'Yesterday',
      attendance: { '2026-07-24': false },
      notes: 'Needs additional practice on Zabar and Zer distinction.',
    },
  ]);

  const [newStudentName, setNewStudentName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggleAttendance = (id: string) => {
    setStudents(prev =>
      prev.map(st => {
        if (st.id === id) {
          const currentAtt = st.attendance[todayStr] ?? false;
          return {
            ...st,
            attendance: {
              ...st.attendance,
              [todayStr]: !currentAtt,
            },
          };
        }
        return st;
      })
    );
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const colors = ['bg-amber-500', 'bg-purple-500', 'bg-cyan-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newSt: StudentRecord = {
      id: `st_${Date.now()}`,
      name: newStudentName.trim(),
      avatarColor: randomColor,
      completedLessons: 1,
      accuracy: 100,
      timeSpentMinutes: 10,
      lastActive: 'Today',
      attendance: { [todayStr]: true },
      notes: 'New student added.',
    };

    setStudents(prev => [...prev, newSt]);
    setNewStudentName('');
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-indigo-200 w-full max-w-3xl my-8 relative text-gray-800"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Teacher Dashboard</h2>
              <p className="text-xs text-gray-500">Madrasa & Class Roster Management</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow transition"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Date & Quick Attendance Header */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-indigo-900 text-sm">Class Date: {todayStr}</span>
          </div>
          <span className="text-xs font-bold text-indigo-700">
            Present: {students.filter(s => s.attendance[todayStr]).length} / {students.length}
          </span>
        </div>

        {/* Roster Table */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {students.map(st => {
            const isPresent = st.attendance[todayStr] ?? false;

            return (
              <div
                key={st.id}
                className="bg-white border p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${st.avatarColor} text-white font-black text-base flex items-center justify-center shadow`}>
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{st.name}</h4>
                    <p className="text-[11px] text-gray-500">
                      Sabaq Completed: {st.completedLessons}/12 • Accuracy: {st.accuracy}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleToggleAttendance(st.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isPresent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isPresent ? 'Present' : 'Absent'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Student Modal overlay */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Add New Student</h4>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="Student Full Name"
                  className="w-full p-3 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1 bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow"
                  >
                    <Plus className="w-4 h-4" /> Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
