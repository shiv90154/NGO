export const ROLES = {
  super_admin: 'super_admin',
  admin: 'admin',
  additional_director: 'additional_director',
  state_officer: 'state_officer',
  district_manager: 'district_manager',
  district_president: 'district_president',
  block_officer: 'block_officer',
  village_officer: 'village_officer',
  field_officer: 'field_officer',
  manager: 'manager',
  user: 'user',
  doctor: 'doctor',
};

export const ROLE_HIERARCHY = [
  'super_admin',
  'admin',
  'additional_director',
  'state_officer',
  'district_manager',
  'district_president',
  'block_officer',
  'village_officer',
  'field_officer',
  'manager',
  'user',
];

export const isHigherOrEqual = (role1, role2) => {
  const index1 = ROLE_HIERARCHY.indexOf(role1);
  const index2 = ROLE_HIERARCHY.indexOf(role2);
  if (index1 === -1 || index2 === -1) return false;
  return index1 <= index2;
};