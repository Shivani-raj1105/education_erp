import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import {
  useTechnicalEventList,
  useCreateTechnicalEvent,
  useUpdateTechnicalEvent,
  useDeleteTechnicalEvent,
} from '../../../hooks/useActivities';
import SearchBar from '../../../components/ui/SearchBar';
import Pagination from '../../../components/ui/Pagination';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const STATUSES  = ['ONGOING', 'COMPLETED'];
const EVENT_TYPES = [
  'Hackathon',
  'Project',
  'Paper Presentation',
  'Coding Contest',
  'Workshop',
  'Seminar',
  'Internship',
  'Other',
];
const STATUS_COLORS = {
  ONGOING:   'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  COMPLETED: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const COLS = [
  { key: 'studentName',   label: 'Student Name' },
  { key: 'usn',           label: 'USN / Roll No' },
  { key: null,            label: 'Department' },
  { key: 'section',       label: 'Section' },
  { key: 'semester',      label: 'Sem' },
  { key: 'eventType',     label: 'Event Type' },
  { key: 'projectName',   label: 'Project / Event' },
  { key: 'projectDomain', label: 'Domain' },
  { key: null,            label: 'Faculty Mentor' },
  { key: 'academicYear',  label: 'Academic Year' },
  { key: 'projectStatus', label: 'Status' },
  { key: null,            label: '' },
];

const Field = ({ label, error, children, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

function TechnicalEventForm({ defaultValues, onSubmit, onCancel, isSaving }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || { projectStatus: 'ONGOING', semester: 1 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Student Name" required error={errors.studentName?.message}>
          <input
            {...register('studentName', { required: 'Required', maxLength: { value: 150, message: 'Too long' } })}
            className={clsx('input-field', errors.studentName && 'border-red-400')}
            placeholder="e.g. Arun Kumar"
          />
        </Field>

        <Field label="USN / Roll Number" required error={errors.usn?.message}>
          <input
            {...register('usn', { required: 'Required', maxLength: { value: 30, message: 'Too long' } })}
            className={clsx('input-field', errors.usn && 'border-red-400')}
            placeholder="e.g. 1RN21CS001"
          />
        </Field>

        <Field label="Department" required error={errors.department?.message}>
          <input
            {...register('department', { required: 'Required' })}
            className={clsx('input-field', errors.department && 'border-red-400')}
            placeholder="e.g. Computer Science"
          />
        </Field>

        <Field label="Section" required error={errors.section?.message}>
          <input
            {...register('section', { required: 'Required', maxLength: { value: 10, message: 'Too long' } })}
            className={clsx('input-field', errors.section && 'border-red-400')}
            placeholder="e.g. A"
          />
        </Field>

        <Field label="Semester" required error={errors.semester?.message}>
          <select
            {...register('semester', { required: 'Required', valueAsNumber: true })}
            className={clsx('input-field', errors.semester && 'border-red-400')}
          >
            {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </Field>

        <Field label="Event Type" required error={errors.eventType?.message}>
          <select
            {...register('eventType', { required: 'Required' })}
            className={clsx('input-field', errors.eventType && 'border-red-400')}
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Academic Year" required error={errors.academicYear?.message}>
          <input
            {...register('academicYear', {
              required: 'Required',
              pattern: { value: /^\d{4}-\d{2,4}$/, message: 'Format: 2024-25' },
            })}
            className={clsx('input-field', errors.academicYear && 'border-red-400')}
            placeholder="e.g. 2024-25"
          />
        </Field>

        <Field label="Project / Event Name" required error={errors.projectName?.message}>
          <input
            {...register('projectName', { required: 'Required', maxLength: { value: 200, message: 'Too long' } })}
            className={clsx('input-field', errors.projectName && 'border-red-400')}
            placeholder="e.g. AI-Based Attendance System"
          />
        </Field>

        <Field label="Project Domain" required error={errors.projectDomain?.message}>
          <input
            {...register('projectDomain', { required: 'Required', maxLength: { value: 150, message: 'Too long' } })}
            className={clsx('input-field', errors.projectDomain && 'border-red-400')}
            placeholder="e.g. Machine Learning"
          />
        </Field>

        <Field label="Faculty Mentor (optional)" error={errors.facultyMentor?.message}>
          <input
            {...register('facultyMentor')}
            className="input-field"
            placeholder="e.g. Dr. Ramesh Kumar"
          />
        </Field>

        <Field label="Project Status" error={errors.projectStatus?.message}>
          <select {...register('projectStatus')} className="input-field">
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSaving}>
          {defaultValues ? 'Save Changes' : 'Add Event'}
        </Button>
      </div>
    </form>
  );
}

export default function TechnicalEvents() {
  const qc = useQueryClient();

  const [search,    setSearch]    = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy,    setSortBy]    = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page,      setPage]      = useState(1);

  const [modalOpen,    setModalOpen]    = useState(false);
  const [editRecord,   setEditRecord]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryParams = {
    page, limit: 10,
    search:    search    || undefined,
    status:    statusFilter || undefined,
    sortBy,    sortOrder,
  };

  const { data, isLoading, isFetching } = useTechnicalEventList(queryParams);
  const records    = data?.data       || [];
  const pagination = data?.pagination || {};

  const createMutation = useCreateTechnicalEvent({
    onSuccess: () => { setModalOpen(false); },
  });

  const updateMutation = useUpdateTechnicalEvent(editRecord?.id, {
    onSuccess: () => { setModalOpen(false); setEditRecord(null); },
  });

  const deleteMutation = useDeleteTechnicalEvent({
    onSuccess: () => setDeleteTarget(null),
  });

  const handleSort = (field) => {
    if (!field) return;
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    setPage(1);
  };

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const openAdd  = () => { setEditRecord(null); setModalOpen(true); };
  const openEdit = (rec) => { setEditRecord(rec); setModalOpen(true); };

  const handleFormSubmit = (formData) => {
    if (editRecord) updateMutation.mutate(formData);
    else            createMutation.mutate(formData);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Technical Events</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination.total ?? '—'} records in your department
          </p>
        </div>
        <Button onClick={openAdd} size="md">
          <Plus size={15} /> Add Record
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, USN, project, domain, event type..."
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field w-full sm:w-44"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
        </select>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ['technicalEvents'] })}
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
                {COLS.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(col.key)}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap',
                      col.key && 'cursor-pointer hover:text-gray-900 dark:hover:text-white select-none'
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && sortBy === col.key && (
                        <ArrowUpDown size={12} className="text-indigo-500" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(COLS.length)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={COLS.length} className="text-center py-16 text-gray-400 dark:text-gray-500">
                    {search ? `No records found for "${search}"` : 'No technical events added yet.'}
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{rec.studentName}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap">{rec.usn}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate">{rec.department}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {rec.section}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{rec.semester}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                        {rec.eventType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-[160px] truncate font-medium" title={rec.projectName}>{rec.projectName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate" title={rec.projectDomain}>{rec.projectDomain}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[130px] truncate">
                      {rec.facultyMentor || <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{rec.academicYear}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap', STATUS_COLORS[rec.projectStatus] || STATUS_COLORS.ONGOING)}>
                        {rec.projectStatus === 'COMPLETED' ? 'Completed' : 'Ongoing'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(rec)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Edit"
                          aria-label="Edit record"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(rec)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                          aria-label="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <Pagination pagination={pagination} onPageChange={setPage} />
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecord(null); }}
        title={editRecord ? 'Edit Technical Event' : 'Add Technical Event'}
        size="lg"
      >
        <TechnicalEventForm
          defaultValues={editRecord || null}
          onSubmit={handleFormSubmit}
          onCancel={() => { setModalOpen(false); setEditRecord(null); }}
          isSaving={isSaving}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete Technical Event"
        message={`Are you sure you want to delete the record for "${deleteTarget?.studentName} — ${deleteTarget?.projectName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
