export const RBAC = {
  // 1. Super Admin Level (Absolute access)
  isSuperAdmin: (role?: string) => ['SUPER_ADMIN'].includes(role || ''),
  
  // 2. Foundation / Management Level
  isYayasanLevel: (role?: string) => ['SUPER_ADMIN', 'KETUA_YAYASAN', 'BENDAHARA_YAYASAN'].includes(role || ''),

  // 3. School Leadership Level
  isLeadershipLevel: (role?: string) => ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'WAKASEK_KESISWAAN', 'WAKASEK_HUBIN', 'ADMIN'].includes(role || ''),

  // 4. Admin / Operational Level (Equivalent to legacy 'ADMIN')
  isAdminLevel: (role?: string) => ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'TATA_USAHA', 'ADMIN'].includes(role || ''),

  // 5. Finance Level
  isFinanceLevel: (role?: string) => ['SUPER_ADMIN', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'ADMIN'].includes(role || ''),

  // 6. Teacher / Academic Level (Equivalent to legacy 'TEACHER')
  isTeacherLevel: (role?: string) => ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'KAPROG', 'GURU_MAPEL', 'WALI_KELAS', 'GURU_BK', 'TEACHER', 'ADMIN'].includes(role || ''),

  // 7. Support Staff Level
  isSupportLevel: (role?: string) => ['KEPALA_LAB', 'PUSTAKAWAN', 'PETUGAS_UKS', 'STAF_SARPRAS'].includes(role || ''),

  // 8. Student Level (Equivalent to legacy 'STUDENT')
  isStudentLevel: (role?: string) => ['SISWA', 'STUDENT'].includes(role || ''),

  // 9. Parent Level (Equivalent to legacy 'PARENT')
  isParentLevel: (role?: string) => ['ORANG_TUA', 'PARENT'].includes(role || ''),

  // 10. Alumni Level
  isAlumniLevel: (role?: string) => ['ALUMNI'].includes(role || ''),
  
  // Legacy mappings for quick checks
  canAccessAdminDashboard: (role?: string) => ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'WAKASEK_KESISWAAN', 'WAKASEK_HUBIN', 'KAPROG', 'TATA_USAHA', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'ADMIN'].includes(role || ''),
  
  canManageUsers: (role?: string) => ['SUPER_ADMIN', 'TATA_USAHA', 'ADMIN'].includes(role || ''),
  
  canManageFinance: (role?: string) => ['SUPER_ADMIN', 'KETUA_YAYASAN', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'ADMIN'].includes(role || ''),
  
  canManageAcademics: (role?: string) => ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'KAPROG', 'TATA_USAHA', 'ADMIN'].includes(role || '')
};
