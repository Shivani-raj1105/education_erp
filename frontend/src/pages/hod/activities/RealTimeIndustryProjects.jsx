import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, RefreshCw, Plus, Pencil, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import {
  useIndustryProjectList,
  useCreateIndustryProject,
  useUpdateIndustryProject,
  useDeleteIndustryProject,
  useAddProjectStudent,
  useRemoveProjectStudent,
} from '../../../hooks/useActivities';
import SearchBar from '../../../components/ui/SearchBar';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) =>
  status === 'ONGOING' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Ongoing
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      Completed
    </span>
  );

// ─── Shared Field wrapper ─────────────────────────────────────────────────────
const Field = ({ label, error, children, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// ─── Project form (add/edit project) ─────────────────────────────────────────
function ProjectForm({ defaultValues, onSubmit, onCancel, isSaving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || { status: 'ONGOING' },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Project Name" required error={errors.projectName?.message}>
        <input
          {...register('projectName', { required: 'Required', maxLength: { value: 200, message: 'Too long' } })}
          className={clsx('input-field', errors.projectName && 'border-red-400')}
          placeholder="e.g. Education ERP"
        />
      </Field>
      <Field label="Status" error={errors.status?.message}>
        <select {...register('status')} className="input-field">
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </Field>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSaving}>
          {defaultValues ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

// ─── Add student form ─────────────────────────────────────────────────────────
function AddStudentForm({ onSubmit, onCancel, isSaving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { semester: 1 },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Student Name" required error={errors.studentName?.message}>
          <input
            {...register('studentName', { required: 'Required' })}
            className={clsx('input-field', errors.studentName && 'border-red-400')}
            placeholder="e.g. Arun Kumar"
          />
        </Field>
        <Field label="USN" required error={errors.usn?.message}>
          <input
            {...register('usn', { required: 'Required' })}
            className={clsx('input-field', errors.usn && 'border-red-400')}
            placeholder="e.g. 1RN21CS001"
          />
        </Field>
        <Field label="Semester" required error={errors.semester?.message}>
          <select {...register('semester', { required: 'Required', valueAsNumber: true })} className="input-field">
            {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </Field>
        <Field label="Section" required error={errors.section?.message}>
          <input
            {...register('section', { required: 'Required' })}
            className={clsx('input-field', errors.section && 'border-red-400')}
            placeholder="e.g. A"
          />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSaving}>Add Student</Button>
      </div>
    </form>
  );
}

// ─── Expanded student rows ────────────────────────────────────────────────────
function ExpandedStudents({ project }) {
  const [removeTarget, setRemoveTarget] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const addStudentMutation = useAddProjectStudent(project.id, {
    onSuccess: () => setAddOpen(false),
  });
  const removeStudentMutation = useRemoveProjectStudent({
    onSuccess: () => setRemoveTarget(null),
  });

  const students = project.students || [];

  return (
    <tr>
      <td colSpan={4} className="px-0 pb-0">
        <div className="mx-4 mb-4 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50/70 dark:bg-gray-900/30">
          {/* Student table header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100/80 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Students ({students.length})
            </span>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              <UserPlus size={13} /> Add Student
            </button>
          </div>

          {students.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
              No students assigned yet. Click "Add Student" to add one.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">USN</th>
                  <th className="px-4 py-2 text-left">Semester</th>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white">{s.studentName}</td>
                    <td className="px-4 py-2.5 text-sm font-mono text-gray-600 dark:text-gray-300">{s.usn}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">Sem {s.semester}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {s.section}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => setRemoveTarget(s)}
                        className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove student"
                        aria-label="Remove student"
                      >
                        <UserMinus size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Student Modal */}
        <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Student to Project" size="md">
          <AddStudentForm
            onSubmit={(data) => addStudentMutation.mutate(data)}
            onCancel={() => setAddOpen(false)}
            isSaving={addStudentMutation.isPending}
          />
        </Modal>

        {/* Remove Confirm */}
        <ConfirmDialog
          isOpen={!!removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={() => removeStudentMutation.mutate({ projectId: project.id, studentId: removeTarget.id })}
          loading={removeStudentMutation.isPending}
          title="Remove Student"
          message={`Remove ${removeTarget?.studentName} (${removeTarget?.usn}) from this project?`}
          confirmLabel="Remove"
          variant="danger"
        />
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function RealTimeIndustryProjects() {
  const qc = useQueryClient();

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId,   setExpandedId]   = useState(null);

  const [modalOpen,    setModalOpen]    = useState(false);
  const [editProject,  setEditProject]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryParams = {
    search: search || undefined,
    status: statusFilter || undefined,
  };

  const { data, isLoading, isFetching } = useIndustryProjectList(queryParams);
  const projects = data?.data || [];

  const createMutation = useCreateIndustryProject({ onSuccess: () => setModalOpen(false) });
  const updateMutation = useUpdateIndustryProject(editProject?.id, {
    onSuccess: () => { setModalOpen(false); setEditProject(null); },
  });
  const deleteMutation = useDeleteIndustryProject({ onSuccess: () => setDeleteTarget(null) });

  const handleSearch = (val) => setSearch(val);

  const openAdd  = () => { setEditProject(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProject(p);   setModalOpen(true); };

  const handleFormSubmit = (data) => {
    if (editProject) updateMutation.mutate(data);
    else             createMutation.mutate(data);
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Real-Time Industry Projects</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your department
          </p>
        </div>
        <Button onClick={openAdd} size="md">
          <Plus size={15} /> Add Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by project name..."
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-full sm:w-44"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ['industryProjects'] })}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Refresh"
          title="Refresh"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50">
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400 dark:text-gray-500">
                    {search ? `No projects found for "${search}"` : 'No industry projects added yet.'}
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <React.Fragment key={project.id}>
                    {/* Project row */}
                    <tr
                      className={clsx(
                        'border-b border-gray-50 dark:border-gray-700/50 transition-colors cursor-pointer',
                        expandedId === project.id
                          ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
                          : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                      )}
                      onClick={() => toggleExpand(project.id)}
                    >
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {project.projectName}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {project.students?.length ?? 0} student{(project.students?.length ?? 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(project); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit project"
                            aria-label="Edit project"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(project); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete project"
                            aria-label="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleExpand(project.id); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            aria-label={expandedId === project.id ? 'Collapse' : 'Expand'}
                          >
                            {expandedId === project.id
                              ? <ChevronDown size={16} className="text-indigo-500" />
                              : <ChevronRight size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded student rows */}
                    {expandedId === project.id && (
                      <ExpandedStudents project={project} />
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProject(null); }}
        title={editProject ? 'Edit Project' : 'Add Industry Project'}
        size="sm"
      >
        <ProjectForm
          defaultValues={editProject || null}
          onSubmit={handleFormSubmit}
          onCancel={() => { setModalOpen(false); setEditProject(null); }}
          isSaving={isSaving}
        />
      </Modal>

      {/* Delete Project Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete Project"
        message={`Delete "${deleteTarget?.projectName}"? All student records for this project will also be removed.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
