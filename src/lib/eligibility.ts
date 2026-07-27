export type EligibilityInput = {
  representedInCurrentKnesset: boolean;
  nationwidePollAppearancesInRolling30Days: number;
  ownerException: boolean;
};

export function isPartyEligible(input: EligibilityInput): boolean {
  return (
    input.representedInCurrentKnesset ||
    input.nationwidePollAppearancesInRolling30Days >= 2 ||
    input.ownerException
  );
}
