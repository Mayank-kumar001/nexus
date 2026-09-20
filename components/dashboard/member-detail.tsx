"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { CheckCircle, Clock, Warning } from "@phosphor-icons/react";

/* ──────────────────────── Types ──────────────────────── */

interface Task {
  title: string;
  status: string;
  dueDate: string;
}

interface MemberData {
  name: string;
  role: string;
  gradient: string;
  tasksCompleted: number;
  totalTasks: number;
  avatar: string;
  tagColor: string;
  tasks: Task[];
  roleDistribution: { name: string; value: number; color: string }[];
}

interface MemberDetailProps {
  member: MemberData | null;
  onClose: () => void;
}

/* ──────────────────────── Helpers ─────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "completed")
    return <CheckCircle size={20} weight="fill" className="text-[#11c15b]" />;
  if (status === "in-progress")
    return <Clock size={20} weight="fill" className="text-[#ff8a65]" />;
  return <Warning size={20} weight="fill" className="text-gray-400" />;
};

const statusLabel: Record<string, string> = {
  completed: "Done",
  "in-progress": "In Progress",
  pending: "Pending",
};

const statusStyles: Record<string, string> = {
  completed: "bg-[#11c15b]/15 text-[#11c15b] border border-[#11c15b]/20",
  "in-progress": "bg-[#ff8a65]/15 text-[#ff8a65] border border-[#ff8a65]/20",
  pending: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
};

/* ──────────── Custom Label for Donut Chart ──────────── */

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ccc"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {name} {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ──────────────────────── Component ──────────────────── */

export function MemberDetail({ member, onClose }: MemberDetailProps) {
  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key="member-detail-wrapper"
          className="fixed inset-0 z-[100] flex flex-col bg-[#111111] overflow-y-auto"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="fixed top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer backdrop-blur-md"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>

          {/* ─── Header ─── */}
          <div
            className={`relative overflow-hidden p-10 sm:p-20 ${member.gradient} min-h-[35vh] flex items-end`}
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full max-w-4xl mx-auto">
              <motion.div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover bg-white/10"
                />
              </motion.div>
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease }}
              >
                <h2 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-2">
                  {member.name}
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <span className="inline-block text-sm font-semibold uppercase tracking-widest text-white/90 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    {member.role}
                  </span>
                  <p className="text-white/80 text-base font-medium">
                    {member.tasksCompleted}/{member.totalTasks} tasks completed
                    &nbsp;·&nbsp;
                    {Math.round(
                      (member.tasksCompleted / member.totalTasks) * 100
                    )}
                    % rate
                  </p>
                </div>
              </motion.div>
            </div>
            {/* Decorative blurs */}
            <div className="absolute -right-8 -top-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl" />
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto p-6 sm:p-10 grid grid-cols-1 gap-10 pb-20">
            {/* ─── Role Distribution Chart ─── */}
            <motion.div
              className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#2a2a2a] shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                Role Distribution
              </h3>
              <div className="flex flex-col items-center gap-8">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={member.roleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        label={renderCustomLabel}
                        labelLine={false}
                        animationBegin={400}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {member.roleDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          background: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: 500,
                          padding: "12px",
                        }}
                        formatter={(value: any) => [`${value}%`, "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend cards */}
                <div className="w-full grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {member.roleDistribution.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + (i * 0.1), ease }}
                      className="flex items-center gap-3 bg-[#222] rounded-xl px-4 py-3 border border-[#333]"
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-white/80 font-medium flex-1">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {item.value}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ─── Work History ─── */}
            <motion.div
              className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#2a2a2a] shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                Work History
              </h3>
              <div className="space-y-4">
                {member.tasks.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.7 + i * 0.1,
                      ease,
                    }}
                    className="flex items-start gap-4 bg-[#222] rounded-2xl px-6 py-5 border border-[#333] hover:border-[#444] transition-colors shadow-sm"
                  >
                    <div className="mt-1 bg-[#111] p-2 rounded-full">
                      <StatusIcon status={task.status} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p
                        className={`text-base font-medium ${task.status === "completed"
                          ? "text-white/50 line-through"
                          : "text-white"
                          }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-sm text-white/40 mt-1.5 block">
                        Due: {task.dueDate}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span
                        className={`text-[11px] uppercase font-bold px-3 py-1.5 rounded-full shrink-0 ${statusStyles[task.status]}`}
                      >
                        {statusLabel[task.status]}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
