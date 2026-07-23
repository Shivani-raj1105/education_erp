const bcrypt = require('bcryptjs');
const facultyRepo = require('../repositories/faculty.repository');
const auditRepo = require('../repositories/audit.repository');

/**
 * Get paginated faculty list (department-scoped)
 */
const getFacultyList = async (departmentCode, queryParams) => {
  const page    = Math.max(1, parseInt(queryParams.page)  || 1);
  const limit   = Math.min(100, parseInt(queryParams.limit) || 10);
  const search  = queryParams.search?.trim() || null;
  const status  = queryParams.status  || null;
  const sortBy  = queryParams.sortBy  || 'name';
  const sortOrder = queryParams.sortOrder || 'asc';

  const { items, total } = await facultyRepo.findAllByDepartment(departmentCode, {
    page, limit, search, status, sortBy, sortOrder,
  });

  return {
    items: items.map(sanitizeFaculty),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

/**
 * Get faculty by id (department-scoped)
 * ID is the employeeId (string like "EMP001")
 */
const getFacultyById = async (id, requestingDepartmentCode) => {
  const faculty = await facultyRepo.findById(id);
  if (!faculty) {
    throw { statusCode: 404, message: 'Faculty not found.' };
  }
  if (faculty.departmentCode !== requestingDepartmentCode) {
    throw { statusCode: 403, message: 'Access denied.' };
  }
  return sanitizeFaculty(faculty);
};

/**
 * Create faculty
 */
const createFaculty = async (data, createdBy, departmentCode) => {
  // Check uniqueness
  const conflict = await facultyRepo.checkUnique({
    employeeId: data.employeeId,
    username:   data.username,
    email:      data.email,
  });
  if (conflict) {
    const field = conflict.employeeId === data.employeeId ? 'Employee ID'
                : conflict.username   === data.username   ? 'Username'
                : 'Email';
    throw { statusCode: 409, message: `${field} already exists.` };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const faculty = await facultyRepo.create({
    employeeId:       data.employeeId,
    name:             data.name,
    email:            data.email,
    phone:            data.phone || null,
    designation:      data.designation,
    qualification:    data.qualification,
    experience:       parseInt(data.experience) || 0,
    specialization:   data.specialization || null,
    joiningDate:      new Date(data.joiningDate),
    status:           data.status || 'ACTIVE',
    departmentCode,
    username:         data.username,
    passwordHash,
    coordinatorRoles: null,  // No roles initially
  });

  await auditRepo.log({
    performedBy: createdBy,
    action:      'CREATE_FACULTY',
    facultyId:   faculty.employeeId,
    details:     { name: faculty.name, employeeId: faculty.employeeId },
  });

  return sanitizeFaculty(faculty);
};

/**
 * Update faculty
 */
const updateFaculty = async (id, data, updatedBy, departmentCode) => {
  const existing = await facultyRepo.findById(id);
  if (!existing) {
    throw { statusCode: 404, message: 'Faculty not found.' };
  }
  if (existing.departmentCode !== departmentCode) {
    throw { statusCode: 403, message: 'Access denied.' };
  }

  // Check uniqueness excluding current record
  const conflict = await facultyRepo.checkUnique(
    {
      ...(data.employeeId && { employeeId: data.employeeId }),
      ...(data.email      && { email:      data.email }),
    },
    id
  );
  if (conflict) {
    const field = conflict.employeeId === data.employeeId ? 'Employee ID' : 'Email';
    throw { statusCode: 409, message: `${field} already exists.` };
  }

  const updateData = {};
  const fields = ['name','email','phone','designation','qualification','experience',
                  'specialization','joiningDate','status','photo'];
  fields.forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f];
  });
  if (data.employeeId) updateData.employeeId = data.employeeId;
  if (data.joiningDate) updateData.joiningDate = new Date(data.joiningDate);
  if (data.experience !== undefined) updateData.experience = parseInt(data.experience);

  // Allow password update
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  const updated = await facultyRepo.update(id, updateData);

  await auditRepo.log({
    performedBy: updatedBy,
    action:      'UPDATE_FACULTY',
    facultyId:   id,
    details:     { updatedFields: Object.keys(updateData) },
  });

  return sanitizeFaculty(updated);
};

/**
 * Delete faculty
 */
const deleteFaculty = async (id, deletedBy, departmentCode) => {
  const faculty = await facultyRepo.findById(id);
  if (!faculty) {
    throw { statusCode: 404, message: 'Faculty not found.' };
  }
  if (faculty.departmentCode !== departmentCode) {
    throw { statusCode: 403, message: 'Access denied.' };
  }

  // Cannot delete HOD
  const isHOD = faculty.designation.includes('HOD');
  if (isHOD) {
    throw { statusCode: 400, message: 'Cannot delete HOD. Reassign HOD role first.' };
  }

  await auditRepo.log({
    performedBy: deletedBy,
    action:      'DELETE_FACULTY',
    facultyId:   null,
    details:     { name: faculty.name, employeeId: faculty.employeeId },
  });

  await facultyRepo.remove(id);
  return { message: 'Faculty deleted successfully.' };
};

/**
 * Assign or remove coordinator roles
 */
const syncRoles = async (facultyId, { add, remove }, syncedBy, departmentCode) => {
  const faculty = await facultyRepo.findById(facultyId);
  if (!faculty) throw { statusCode: 404, message: 'Faculty not found.' };
  if (faculty.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };

  // Current roles as array
  const currentRoles = faculty.coordinatorRoles 
    ? faculty.coordinatorRoles.split(',').map(r => r.trim())
    : [];

  // Add roles
  const VALID_ROLES = ['TIMETABLE_COORDINATOR', 'EXAM_COORDINATOR', 'CULTURAL_COORDINATOR', 'PLACEMENT_COORDINATOR'];
  let newRoles = [...currentRoles];
  
  for (const roleId of (add || [])) {
    // roleId is actually the role slug from frontend
    if (VALID_ROLES.includes(roleId) && !newRoles.includes(roleId)) {
      newRoles.push(roleId);
    }
  }

  for (const roleId of (remove || [])) {
    newRoles = newRoles.filter(r => r !== roleId);
  }

  const coordinatorRoles = newRoles.length > 0 ? newRoles.join(',') : null;
  await facultyRepo.update(facultyId, { coordinatorRoles });

  // Log the changes
  const added = (add || []).filter(r => !currentRoles.includes(r));
  const removed = (remove || []).filter(r => currentRoles.includes(r));

  if (added.length > 0) {
    await auditRepo.log({
      performedBy: syncedBy,
      action: 'ASSIGN_ROLE',
      facultyId,
      details: { roles: added },
    });
  }

  if (removed.length > 0) {
    await auditRepo.log({
      performedBy: syncedBy,
      action: 'REMOVE_ROLE',
      facultyId,
      details: { roles: removed },
    });
  }

  const updated = await facultyRepo.findById(facultyId);
  return {
    data: sanitizeFaculty(updated),
    results: { added, removed },
  };
};

/**
 * Format faculty object for API response
 */
const sanitizeFaculty = (f) => {
  const { passwordHash, ...safe } = f;
  
  // Convert coordinatorRoles string to roles array for frontend
  const coordinatorRoles = f.coordinatorRoles 
    ? f.coordinatorRoles.split(',').map(r => ({
        role: { id: null, name: r.trim(), slug: r.trim() }
      }))
    : [];
  
  const isHOD = f.designation.includes('HOD');
  const roles = [...coordinatorRoles];
  
  if (isHOD) {
    roles.push({ role: { id: null, name: 'HOD', slug: 'HOD' } });
    roles.push({ role: { id: null, name: 'Faculty', slug: 'FACULTY' } });
  } else {
    roles.push({ role: { id: null, name: 'Faculty', slug: 'FACULTY' } });
  }

  return {
    ...safe,
    roles,
    department: {
      id: null,
      name: f.departmentCode,
      code: f.departmentCode,
    },
  };
};

module.exports = {
  getFacultyList,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  syncRoles,
};
