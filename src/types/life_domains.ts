export const life_domains = {
    ContributionToSociety: 'Contribution to Society',
    Community: 'Community',
    Family: 'Family',
    Friends: 'Friends',
    IntimateRelationship: 'Intimate Relationship',
    PersonalGrowth: 'Personal Growth',
    PhysicalHealth: 'Physical Health',
    Work: 'Work',
} as const;

export type LifeDomainKeys = keyof typeof life_domains;
