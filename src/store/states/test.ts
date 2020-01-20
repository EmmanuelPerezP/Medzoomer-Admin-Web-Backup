export interface Profile {
  name: string;
  age: number;
  adult?: boolean;
  color?: string;
}

export interface Test {
  profile?: Profile;
  list: any[];
  pending: boolean;
}

export function initTest(): Test {
  return {
    profile: undefined,
    list: [],
    pending: false
  };
}
