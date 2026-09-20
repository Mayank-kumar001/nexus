"use client";

import React, { useState, useEffect } from 'react';
import { Code, PaintBrush, Megaphone, UserGear, TrendUp, CalendarCheck, CheckCircle, Clock, Warning } from '@phosphor-icons/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { MemberDetail } from '@/components/dashboard/member-detail';
import { FadeUp, BlurReveal, TextReveal } from '@/components/ui/motion-reveal';

const ease = [0.22, 1, 0.36, 1] as const;

// --- Team Members ---
const teamMembers = [
  { 
    name: 'Mayank', role: 'Tech', icon: Code, 
    gradient: 'bg-gradient-to-r from-[#0e9dec] to-[#0b80c1]', 
    tasksCompleted: 12, totalTasks: 15,
    roleDistribution: [
      { name: 'Tech', value: 50, color: '#0e9dec' },
      { name: 'Open Source', value: 30, color: '#11c15b' },
      { name: 'DevOps', value: 20, color: '#ff8a65' },
    ],
  },
  { 
    name: 'Raghav', role: 'Social Design', icon: Megaphone, 
    gradient: 'bg-gradient-to-r from-[#11c15b] to-[#0a9e48]', 
    tasksCompleted: 8, totalTasks: 10,
    roleDistribution: [
      { name: 'Social Design', value: 50, color: '#11c15b' },
      { name: 'Content', value: 30, color: '#ab47bc' },
      { name: 'Branding', value: 20, color: '#0e9dec' },
    ],
  },
  { 
    name: 'Sarthak', role: 'EM', icon: UserGear, 
    gradient: 'bg-gradient-to-r from-[#ff8a65] to-[#f4511e]', 
    tasksCompleted: 14, totalTasks: 16,
    roleDistribution: [
      { name: 'Engineering Mgmt', value: 45, color: '#ff8a65' },
      { name: 'Tech', value: 35, color: '#0e9dec' },
      { name: 'Ops', value: 20, color: '#11c15b' },
    ],
  },
  { 
    name: 'Pranay', role: 'Design', icon: PaintBrush, 
    gradient: 'bg-gradient-to-r from-[#ab47bc] to-[#7b1fa2]', 
    tasksCompleted: 10, totalTasks: 12,
    roleDistribution: [
      { name: 'UI Design', value: 40, color: '#ab47bc' },
      { name: 'Illustration', value: 35, color: '#ff8a65' },
      { name: 'Social Design', value: 25, color: '#11c15b' },
    ],
  },
];

// --- Role Performance Data (weekly trend) ---
const rolePerformanceData = [
  { week: 'W1', Tech: 72, 'Social Design': 55, EM: 80, Design: 60 },
  { week: 'W2', Tech: 78, 'Social Design': 62, EM: 75, Design: 68 },
  { week: 'W3', Tech: 85, 'Social Design': 58, EM: 82, Design: 74 },
  { week: 'W4', Tech: 90, 'Social Design': 70, EM: 88, Design: 80 },
  { week: 'W5', Tech: 82, 'Social Design': 75, EM: 85, Design: 72 },
  { week: 'W6', Tech: 88, 'Social Design': 80, EM: 90, Design: 85 },
];

// --- Role Contribution Data (bar chart) ---
const roleContributionData = [
  { role: 'Tech', completed: 12, pending: 3 },
  { role: 'Social Design', completed: 8, pending: 2 },
  { role: 'EM', completed: 14, pending: 2 },
  { role: 'Design', completed: 10, pending: 2 },
];

// --- Weekly Tasks Assigned ---
const weeklyTasks = [
  {
    member: 'Mayank',
    role: 'Tech',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mayank',
    tagColor: 'bg-[#0e9dec]',
    tasks: [
      { title: 'Set up CI/CD pipeline for staging', status: 'completed', dueDate: 'Mon, Sep 15' },
      { title: 'Fix authentication token refresh bug', status: 'in-progress', dueDate: 'Wed, Sep 17' },
      { title: 'Review PR #142 — API rate limiting', status: 'pending', dueDate: 'Fri, Sep 19' },
    ]
  },
  {
    member: 'Raghav',
    role: 'Social Design',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Raghav',
    tagColor: 'bg-[#11c15b]',
    tasks: [
      { title: 'Design Instagram carousel for launch', status: 'completed', dueDate: 'Mon, Sep 15' },
      { title: 'Create LinkedIn post assets', status: 'completed', dueDate: 'Tue, Sep 16' },
      { title: 'Draft Twitter/X thread copy', status: 'in-progress', dueDate: 'Thu, Sep 18' },
    ]
  },
  {
    member: 'Sarthak',
    role: 'EM',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarthak',
    tagColor: 'bg-[#ff8a65]',
    tasks: [
      { title: 'Sprint planning for Week 39', status: 'completed', dueDate: 'Mon, Sep 15' },
      { title: 'Conduct 1:1s with all team members', status: 'completed', dueDate: 'Wed, Sep 17' },
      { title: 'Finalize Q4 OKRs document', status: 'in-progress', dueDate: 'Fri, Sep 19' },
    ]
  },
  {
    member: 'Pranay',
    role: 'Design',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Pranay',
    tagColor: 'bg-[#ab47bc]',
    tasks: [
      { title: 'Redesign onboarding flow screens', status: 'completed', dueDate: 'Tue, Sep 16' },
      { title: 'Create icon set for dashboard', status: 'in-progress', dueDate: 'Thu, Sep 18' },
      { title: 'Prepare design review deck', status: 'pending', dueDate: 'Fri, Sep 19' },
    ]
  },
];

// --- Subcomponents ---

const MemberCard = ({ name, role, icon: Icon, gradient, tasksCompleted, totalTasks, onClick }: any) => {
  const completionRate = Math.round((tasksCompleted / totalTasks) * 100);
  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-6 text-white shadow-sm cursor-pointer ${gradient}`}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <h6 className="text-sm font-medium opacity-90 mb-1">{role}</h6>
          <h2 className="text-2xl font-bold mb-3">{name}</h2>
          <p className="text-sm opacity-90 mb-1">{tasksCompleted}/{totalTasks} Tasks Done</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease }}
            />
          </div>
          <p className="text-xs opacity-75 mt-1">{completionRate}% completion</p>
        </div>
        <div className="opacity-40">
          <Icon size={48} weight="fill" />
        </div>
      </div>
      {/* Click hint */}
      <div className="absolute bottom-3 right-4 text-white/30 text-[10px] font-semibold uppercase tracking-widest">
        Click to expand →
      </div>
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
    </motion.div>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'completed') return <CheckCircle size={18} weight="fill" className="text-[#11c15b]" />;
  if (status === 'in-progress') return <Clock size={18} weight="fill" className="text-[#ff8a65]" />;
  return <Warning size={18} weight="fill" className="text-gray-400" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'completed': 'bg-[#e8f5e9] text-[#2e7d32]',
    'in-progress': 'bg-[#fff3e0] text-[#e65100]',
    'pending': 'bg-gray-100 text-gray-500',
  };
  const labels: Record<string, string> = {
    'completed': 'Done',
    'in-progress': 'In Progress',
    'pending': 'Pending',
  };
  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// --- Main Page Component ---

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMemberClick = (memberIdx: number) => {
    const member = teamMembers[memberIdx];
    const weeklyData = weeklyTasks[memberIdx];
    setSelectedMember({
      ...member,
      avatar: weeklyData.avatar,
      tagColor: weeklyData.tagColor,
      tasks: weeklyData.tasks,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#333] font-sans p-6 rounded-tl-xl border-l border-t border-[#e2e5e8]">
      
      {/* Header Section */}
      <div className="mb-8 mt-2">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#0e9dec] uppercase mb-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#e3f2fd] border border-[#bbdefb]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0e9dec]"></span>
            </span>
            Overview
          </div>
        </FadeUp>
        
        <BlurReveal delay={0.2}>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-tight font-semibold text-gray-900 mb-2">
            Team <span className="text-[#0e9dec]">Progress</span>
          </h1>
        </BlurReveal>
        
        <FadeUp delay={0.3}>
          <p className="max-w-xl text-sm text-gray-500">
            Monitor overall performance, view member contributions, and track ongoing tasks in real-time.
          </p>
        </FadeUp>
      </div>

      {/* Team Member Cards Row — staggered entry */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.35 },
          },
        }}
      >
        {teamMembers.map((member, idx) => (
          <motion.div
            key={member.name}
            variants={{
              hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.55, ease },
              },
            }}
          >
            <MemberCard
              {...member}
              onClick={() => handleMemberClick(idx)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Charts Row — fade up */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6"
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.6, ease }}
      >
        {/* Role Performance Trend */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h5 className="font-semibold text-gray-800">Role Performance Trend</h5>
            <span className="text-xs text-gray-400 font-medium">Weekly completion rate (%)</span>
          </div>
          <div className="p-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rolePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e9dec" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0e9dec" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#11c15b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#11c15b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8a65" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff8a65" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDesign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ab47bc" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ab47bc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} domain={[40, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="Tech" stroke="#0e9dec" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTech)" />
                <Area type="monotone" dataKey="Social Design" stroke="#11c15b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSocial)" />
                <Area type="monotone" dataKey="EM" stroke="#ff8a65" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEM)" />
                <Area type="monotone" dataKey="Design" stroke="#ab47bc" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDesign)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-6 pb-4">
            {[
              { label: 'Tech (Mayank)', color: '#0e9dec' },
              { label: 'Social Design (Raghav)', color: '#11c15b' },
              { label: 'EM (Sarthak)', color: '#ff8a65' },
              { label: 'Design (Pranay)', color: '#ab47bc' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion by Role (Bar Chart) */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h5 className="font-semibold text-gray-800">Tasks by Role</h5>
            <span className="text-xs text-gray-400 font-medium">Completed vs Pending</span>
          </div>
          <div className="p-4 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleContributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '13px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" name="Completed" fill="#11c15b" radius={[4,4,0,0]} />
                <Bar dataKey="pending" name="Pending" fill="#ff8a65" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Summary */}
          <div className="flex border-t border-gray-100 mt-auto">
            <div className="flex-1 p-4 text-center border-r border-gray-100">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800">
                <div className="w-2 h-2 rounded-full bg-[#11c15b] mr-2"></div>
                44
              </div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <div className="flex-1 p-4 text-center">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800">
                <div className="w-2 h-2 rounded-full bg-[#ff8a65] mr-2"></div>
                9
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Weekly Tasks / Activity Feed — fade in */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.85, ease }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <CalendarCheck size={20} weight="fill" className="text-gray-500" />
          <h5 className="font-semibold text-gray-800">This Week&apos;s Tasks</h5>
          <span className="text-xs text-gray-400 font-medium ml-auto">Sep 15 – Sep 19, 2025</span>
        </div>
        <div className="p-6 space-y-8">
          {weeklyTasks.map((memberBlock, blockIdx) => (
            <motion.div
              key={memberBlock.member}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 + blockIdx * 0.1, ease }}
            >
              {/* Member Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={memberBlock.avatar} alt={memberBlock.member} className="w-full h-full object-cover bg-gray-50" />
                </div>
                <div>
                  <h6 className="text-sm font-semibold text-gray-800">{memberBlock.member}</h6>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${memberBlock.tagColor}`}>
                    {memberBlock.role}
                  </span>
                </div>
              </div>
              {/* Task List */}
              <div className="ml-5 pl-8 border-l-2 border-gray-100 space-y-3">
                {memberBlock.tasks.map((task, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.85 + blockIdx * 0.1 + i * 0.06, ease }}
                  >
                    <div className="mt-0.5">
                      <StatusIcon status={task.status} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {task.title}
                      </p>
                      <span className="text-xs text-gray-400">{task.dueDate}</span>
                    </div>
                    <StatusBadge status={task.status} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Member Detail Overlay */}
      <MemberDetail
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
