// Calculation utilities for Reliability Scores, Lost Revenue, Recovered Revenue, and KPI metrics

/**
 * Calculates a customer's reliability score based on past appointment performance.
 * Completed visits boost score, No-shows severely penalize, late cancellations moderately penalize.
 */
export const calculateReliabilityScore = (customer) => {
  if (!customer) return { score: 100, tier: 'new', label: 'New Client', color: 'indigo' };

  const totalBookings = (customer.completedVisits || 0) + (customer.noShows || 0) + (customer.cancellations || 0);
  if (totalBookings === 0) {
    return { score: 100, tier: 'new', label: 'New Client', color: 'indigo' };
  }

  const completed = customer.completedVisits || 0;
  const noShows = customer.noShows || 0;
  const cancellations = customer.cancellations || 0;

  // Base completion ratio
  let rawScore = (completed / totalBookings) * 100;

  // Heavy penalty for no-shows (unannounced absences hurt the salon most)
  rawScore -= noShows * 10;
  // Moderate penalty for cancellations
  rawScore -= cancellations * 3;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  if (score >= 90) {
    return { score, tier: 'elite', label: 'Elite Client', color: 'emerald', badgeClass: 'badge-emerald' };
  } else if (score >= 75) {
    return { score, tier: 'reliable', label: 'Reliable', color: 'blue', badgeClass: 'badge-blue' };
  } else if (score >= 50) {
    return { score, tier: 'moderate', label: 'Moderate Risk', color: 'amber', badgeClass: 'badge-amber' };
  } else {
    return { score, tier: 'high-risk', label: 'High No-Show Risk', color: 'rose', badgeClass: 'badge-rose' };
  }
};

/**
 * Calculates all dashboard KPIs for a given day or dataset.
 */
export const calculateDashboardKPIs = (appointments, targetDateStr = null) => {
  const targetDate = targetDateStr || new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(app => app.date === targetDate);

  let realizedRevenue = 0;
  let projectedRevenue = 0;
  let lostRevenue = 0;
  let potentialRiskRevenue = 0;

  let completedCount = 0;
  let confirmedCount = 0;
  let bookedCount = 0;
  let noShowCount = 0;
  let cancelledCount = 0;
  let inProgressCount = 0;
  let emptySlotsCount = 0;

  todayAppointments.forEach(app => {
    const price = Number(app.price) || 0;

    switch (app.status) {
      case 'completed':
        completedCount++;
        realizedRevenue += price;
        break;
      case 'confirmed':
        confirmedCount++;
        projectedRevenue += price;
        break;
      case 'booked':
        bookedCount++;
        projectedRevenue += price;
        break;
      case 'in-progress':
        inProgressCount++;
        projectedRevenue += price;
        break;
      case 'no-show':
        noShowCount++;
        lostRevenue += price;
        break;
      case 'cancelled':
        cancelledCount++;
        emptySlotsCount++;
        potentialRiskRevenue += price;
        break;
      default:
        break;
    }
  });

  // Calculate historic recovered revenue across all appointments
  let totalRecoveredRevenue = 0;
  let totalRecoveredCount = 0;
  appointments.forEach(app => {
    if (app.recoveredFromWaitlist || app.isRecovered) {
      totalRecoveredCount++;
      totalRecoveredRevenue += Number(app.price) || 0;
    }
  });

  // Overall no-show rate for all time
  const totalAllTime = appointments.length;
  const totalAllNoShows = appointments.filter(a => a.status === 'no-show').length;
  const totalAllCompleted = appointments.filter(a => a.status === 'completed').length;
  const noShowDenominator = totalAllCompleted + totalAllNoShows;
  const noShowRate = noShowDenominator > 0 ? Math.round((totalAllNoShows / noShowDenominator) * 100) : 0;

  const totalAllCancelled = appointments.filter(a => a.status === 'cancelled').length;
  const cancellationRate = totalAllTime > 0 ? Math.round((totalAllCancelled / totalAllTime) * 100) : 0;

  return {
    todayTotal: todayAppointments.length,
    completedCount,
    confirmedCount,
    bookedCount,
    noShowCount,
    cancelledCount,
    inProgressCount,
    emptySlotsCount,
    realizedRevenue,
    projectedRevenue,
    lostRevenue,
    potentialRiskRevenue,
    totalRecoveredCount,
    totalRecoveredRevenue,
    noShowRate,
    cancellationRate
  };
};

/**
 * Intelligent Waitlist Matcher
 * Scores waitlist candidates based on service match, staff preference, and priority.
 */
export const findWaitlistMatchesForSlot = (slot, waitlist) => {
  if (!slot || !waitlist || waitlist.length === 0) return [];

  const waitingCandidates = waitlist.filter(w => w.status === 'Waiting');

  const scoredMatches = waitingCandidates.map(candidate => {
    let matchScore = 0;
    const reasons = [];

    // Service exact match
    if (candidate.serviceId === slot.serviceId || candidate.serviceName === slot.serviceName) {
      matchScore += 50;
      reasons.push('Service matches exactly');
    }

    // Staff match or flexible
    if (!candidate.staffId || candidate.staffId === 'any' || candidate.staffId === slot.staffId) {
      matchScore += 30;
      reasons.push(candidate.staffId === slot.staffId ? 'Requested this specialist' : 'Flexible with any staff');
    }

    // Priority boost
    if (candidate.priority === 'Urgent') {
      matchScore += 25;
      reasons.push('Urgent priority tag');
    } else if (candidate.priority === 'High') {
      matchScore += 15;
      reasons.push('High priority client');
    }

    // Time window match
    const slotHour = parseInt(slot.time?.split(':')[0] || '12', 10);
    const prefTime = candidate.preferredTime || 'anytime';
    if (prefTime === 'anytime') {
      matchScore += 15;
      reasons.push('Flexible time availability');
    } else if (prefTime === 'morning' && slotHour < 12) {
      matchScore += 20;
      reasons.push('Preferred morning slot');
    } else if (prefTime === 'afternoon' && slotHour >= 12 && slotHour < 17) {
      matchScore += 20;
      reasons.push('Preferred afternoon slot');
    } else if (prefTime === 'evening' && slotHour >= 17) {
      matchScore += 20;
      reasons.push('Preferred evening slot');
    }

    return {
      candidate,
      matchScore,
      reasons
    };
  });

  return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
};
