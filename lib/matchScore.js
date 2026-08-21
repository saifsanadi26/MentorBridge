export function calculateMatchScore(student, mentor) {
  let score = 50;

  if (student?.targetCountry && mentor?.country) {
    if (student.targetCountry === mentor.country) score += 30;
  }

  const studentFieldLower = student?.targetField?.toLowerCase() || "";
  const mentorExpertise = (mentor?.expertise || []).map((e) => String(e).toLowerCase());
  if (
    studentFieldLower &&
    mentorExpertise.some(
      (exp) => studentFieldLower.includes(exp) || exp.includes(studentFieldLower)
    )
  ) {
    score += 15;
  }

  const openSlots = (mentor?.sessions || []).filter((s) => !s.isBooked).length;
  if (openSlots >= 3) score += 5;

  return Math.min(score, 99);
}
