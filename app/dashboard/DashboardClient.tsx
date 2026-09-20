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

// Data is now passed as a prop

// --- Subcomponents ---

const MemberCard = ({ name, role, icon: Icon, gradient, tasksCompleted, totalTasks, onClick }: any) => {
  const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
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

export default function DashboardClient({ data }: { data: any }) {
  const { teamMembers, rolePerformanceData, roleContributionData, weeklyTasks } = data;
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
        {teamMembers.map((member: any, idx: number) => {
          let Icon = UserGear;
          if (member.role.toLowerCase().includes('tech') || member.role.toLowerCase().includes('dev')) Icon = Code;
          else if (member.role.toLowerCase().includes('design')) Icon = PaintBrush;
          else if (member.role.toLowerCase().includes('social') || member.role.toLowerCase().includes('marketing')) Icon = Megaphone;

          return (
            <motion.div
              key={member.id}
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
                icon={Icon}
                onClick={() => handleMemberClick(idx)}
              />
            </motion.div>
          );
        })}
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
                  {Object.keys(rolePerformanceData[0] || {}).filter(k => k !== 'week').map((dep, idx) => {
                    const colors = ['#0e9dec', '#11c15b', '#ff8a65', '#ab47bc'];
                    const color = colors[idx % colors.length];
                    return (
                      <linearGradient key={dep} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} domain={[40, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '13px' }}
                />
                {Object.keys(rolePerformanceData[0] || {}).filter(k => k !== 'week').map((dep, idx) => {
                  const colors = ['#0e9dec', '#11c15b', '#ff8a65', '#ab47bc'];
                  const color = colors[idx % colors.length];
                  return (
                    <Area key={dep} type="monotone" dataKey={dep} stroke={color} strokeWidth={2.5} fillOpacity={1} fill={`url(#color${idx})`} />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-6 pb-4">
            {teamMembers.map((member: any) => (
              <div key={member.id} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: member.roleDistribution[0]?.color || '#0e9dec' }}></div>
                {member.role} ({member.name})
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
                <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '13px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" name="Completed" fill="#11c15b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#ff8a65" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex border-t border-gray-100 mt-auto">
            <div className="flex-1 p-4 text-center border-r border-gray-100">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800">
                <div className="w-2 h-2 rounded-full bg-[#11c15b] mr-2"></div>
                {roleContributionData.reduce((acc: number, curr: any) => acc + curr.completed, 0)}
              </div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <div className="flex-1 p-4 text-center">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800">
                <div className="w-2 h-2 rounded-full bg-[#ff8a65] mr-2"></div>
                {roleContributionData.reduce((acc: number, curr: any) => acc + curr.pending, 0)}
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
          {weeklyTasks.map((memberBlock: any, blockIdx: number) => (
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
                {memberBlock.tasks.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No tasks completed or assigned yet.</p>
                ) : (
                  memberBlock.tasks.map((task: any, i: number) => (
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
                  ))
                )}
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
