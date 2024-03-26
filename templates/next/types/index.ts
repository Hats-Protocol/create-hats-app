export interface IHatWearer {
  id: `0x${string}`;
  ensName?: string | null;
}

export interface Authority {
  label: string;
  link: string;
  gate: string;
  description: string;
}

export interface Responsibility {
  label: string;
  description: string;
  link: string;
}

export interface EligibilityToggle {
  manual: boolean;
  criteria: any[];
}

export interface IpfsDetails {
  name: string;
  description: string;
  guilds: any[]; // @TODO: type this
  spaces: any[]; // @TODO: type this
  responsibilities: Responsibility[];
  authorities: Authority[];
  eligibility: EligibilityToggle;
  toggle: EligibilityToggle;
}
