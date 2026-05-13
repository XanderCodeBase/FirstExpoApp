export const life_domains = {
    IntimateRelationship: 'Intimate Relationship',
    Family: 'Family',
    Friends: 'Friends',
    Community: 'Community',
    Work: 'Work',
    PersonalGrowth: 'Personal Growth',
    PhysicalHealth: 'Physical Health',
    ContributionToSociety: 'Contribution to Society',
} as const;

export type LifeDomains = (typeof life_domains)[keyof typeof life_domains];
