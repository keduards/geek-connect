export function scoreMatch(myProfile: any, otherProfile: any): number {
  // weight: skills overlap 70%, role complement 30%
  const skillsA = new Set(myProfile.skills || [])
  const skillsB = new Set(otherProfile.skills || [])
  let overlap = 0
  skillsB.forEach((s) => {
    if (skillsA.has(s)) overlap++
  })
  const skillsScore =
    overlap / Math.max(1, Math.max(myProfile.skills?.length || 0, otherProfile.skills?.length || 0))
  const roleScore =
    (myProfile.role === 'founder' && otherProfile.role === 'developer') ||
    (myProfile.role === 'developer' && otherProfile.role === 'founder')
      ? 1
      : 0.5

  return skillsScore * 0.7 + roleScore * 0.3
}

export function explainMatch(myProfile: any, otherProfile: any): string {
  const shared = (myProfile.skills || []).filter((s: string) =>
    (otherProfile.skills || []).includes(s)
  )
  const roleComplement = myProfile.role !== otherProfile.role
  return `Shared skills: ${shared.join(', ') || 'none'}. Role complement: ${roleComplement ? 'yes' : 'no'}`
}

