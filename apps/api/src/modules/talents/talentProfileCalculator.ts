export function getDetailedProfileCompletion(profile: any) {
  if (!profile) {
    return {
      percentage: 0,
      missingFields: [
        "fullName",
        "title",
        "phone",
        "country",
        "city",
        "englishLevel",
        "skills",
        "experience",
        "education",
        "cvUrl",
      ],
      isComplete: false,
    };
  }

  const checklist = [
    { field: "fullName", check: () => !!profile.fullName },
    { field: "title", check: () => !!profile.title },
    { field: "phone", check: () => !!profile.phone },
    { field: "country", check: () => !!profile.country },
    { field: "city", check: () => !!profile.city },
    { field: "englishLevel", check: () => !!profile.englishLevel },
    {
      field: "skills",
      check: () => Array.isArray(profile.skills) && profile.skills.length > 0,
    },
    {
      field: "experience",
      check: () =>
        Array.isArray(profile.experience) && profile.experience.length > 0,
    },
    {
      field: "education",
      check: () =>
        Array.isArray(profile.education) && profile.education.length > 0,
    },
    { field: "cvUrl", check: () => !!profile.cvUrl },
  ];

  const missingFields: string[] = [];
  let score = 0;

  for (const item of checklist) {
    if (item.check()) {
      score += 10;
    } else {
      missingFields.push(item.field);
    }
  }

  return {
    percentage: score,
    missingFields,
    isComplete: score === 100,
  };
}

export function computeIsComplete(profile: any): boolean {
  return getDetailedProfileCompletion(profile).isComplete;
}
