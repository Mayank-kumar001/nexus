import React from 'react';
import DashboardClient from './DashboardClient';
import { getDashboardData } from './actions';

export const dynamic = 'force-dynamic'; // Ensure we get fresh data on every load

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  return <DashboardClient data={data} />;
}
