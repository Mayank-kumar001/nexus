import { prisma } from "@/lib/db";

export type DashboardData = {
  teamMembers: any[];
  roleContributionData: any[];
  weeklyTasks: any[];
  rolePerformanceData: any[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const allAchievements = await prisma.achievement.findMany({
    orderBy: { achievedOn: 'desc' },
    include: { submitter: true }
  });

  // Calculate Team Members based ONLY on achievements (work done)
  const memberMap = new Map();

  allAchievements.forEach(ach => {
    if (!memberMap.has(ach.submitterId)) {
      memberMap.set(ach.submitterId, {
        id: ach.submitterId,
        name: ach.submitter?.name || ach.memberName, // Use actual user name
        role: ach.submitter?.department || ach.department || 'Tech',
        tasksCompleted: 0,
        totalTasks: 0,
        departments: {} as Record<string, number>
      });
    }
    
    const member = memberMap.get(ach.submitterId);
    member.totalTasks += 1;
    if (ach.status === 'VERIFIED') {
      member.tasksCompleted += 1;
    }

    // Role distribution based on achievements
    if (!member.departments[ach.department]) {
      member.departments[ach.department] = 0;
    }
    member.departments[ach.department] += 1;
  });

  // Format teamMembers
  const teamMembers = Array.from(memberMap.values()).map(m => {
    // Generate roleDistribution based on their tasks' departments
    const roleDistribution = Object.entries(m.departments).map(([dep, count], idx) => ({
      name: dep,
      value: m.totalTasks > 0 ? Math.round(((count as number) / m.totalTasks) * 100) : 0,
      color: ['#0e9dec', '#11c15b', '#ff8a65', '#ab47bc'][idx % 4]
    }));

    return {
      id: m.id,
      name: m.name,
      role: m.role,
      tasksCompleted: m.tasksCompleted,
      totalTasks: m.totalTasks,
      roleDistribution,
      gradient: getGradient(m.name),
    };
  });

  // Role Contribution (tasks by department)
  const roleMap = new Map();
  allAchievements.forEach(ach => {
    if (!roleMap.has(ach.department)) {
      roleMap.set(ach.department, { role: ach.department, completed: 0, pending: 0 });
    }
    const role = roleMap.get(ach.department);
    if (ach.status === 'VERIFIED') role.completed += 1;
    else if (ach.status === 'PENDING') role.pending += 1;
  });
  const roleContributionData = Array.from(roleMap.values());

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  // Weekly Tasks (recent tasks grouped by member)
  const weeklyTasks = Array.from(memberMap.values()).map(m => {
    const memberTasks = allAchievements
      .filter(a => a.submitterId === m.id && new Date(a.achievedOn) >= startOfWeek)
      .map(a => ({
        title: a.details,
        status: a.status === 'VERIFIED' ? 'completed' : (a.status === 'PENDING' ? 'in-progress' : 'pending'),
        dueDate: a.achievedOn.toISOString().split('T')[0]
      }));
      
    return {
      member: m.name,
      role: m.role,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${m.name}`,
      tagColor: getTagColor(m.name),
      tasks: memberTasks
    };
  });
  
  // Weekly trend Data (dummy for now, but using actual departments)
  const departments = Array.from(roleMap.keys());
  const rolePerformanceData = Array.from({ length: 6 }).map((_, i) => {
    const weekData: any = { week: `W${i + 1}` };
    departments.forEach(dep => {
      // generate a realistic looking trend
      weekData[dep as string] = 40 + Math.floor(Math.random() * 40) + (i * 3);
    });
    return weekData;
  });

  return {
    teamMembers,
    roleContributionData,
    weeklyTasks,
    rolePerformanceData
  };
}

function getGradient(name: string) {
  const gradients = [
    'bg-gradient-to-r from-[#0e9dec] to-[#0b80c1]',
    'bg-gradient-to-r from-[#11c15b] to-[#0a9e48]',
    'bg-gradient-to-r from-[#ff8a65] to-[#f4511e]',
    'bg-gradient-to-r from-[#ab47bc] to-[#7b1fa2]'
  ];
  return gradients[name.length % gradients.length];
}

function getTagColor(name: string) {
  const colors = ['bg-[#0e9dec]', 'bg-[#11c15b]', 'bg-[#ff8a65]', 'bg-[#ab47bc]'];
  return colors[name.length % colors.length];
}
