const ROLES = {
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

const ROLE_HIERARCHY = [
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

const DEFAULT_PERMISSIONS = {
  super_admin: ['create','read','update','delete','manage_users','manage_content','access_reports'],
  admin: ['create','read','update','delete','manage_users','manage_content','access_reports'],
  additional_director: ['create','read','update','delete','manage_content','access_reports'],
  state_officer: ['create','read','update','delete','manage_content','access_reports'],
  district_manager: ['create','read','update','delete','manage_content','access_reports'],
  district_president: ['create','read','update','delete','manage_content','access_reports'],
  block_officer: ['create','read','update','delete','manage_content','access_reports'],
  village_officer: ['create','read','update','delete','manage_content','access_reports'],
  field_officer: ['create','read','update','delete','manage_content','access_reports'],
  manager: ['create','read','update','delete','manage_content','access_reports'],
  user: ['read'],
  doctor: ['create','read','update','delete'],
};

const isHigherOrEqual = (role1, role2) => {
  const index1 = ROLE_HIERARCHY.indexOf(role1);
  const index2 = ROLE_HIERARCHY.indexOf(role2);
  if (index1 === -1 || index2 === -1) return false;
  return index1 <= index2;
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  DEFAULT_PERMISSIONS,
  isHigherOrEqual,
};