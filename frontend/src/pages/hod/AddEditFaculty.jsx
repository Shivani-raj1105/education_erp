import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { facultyService } from '../../services/faculty.service';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Field = ({ label, error, children, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default function AddEditFaculty() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ['faculty', id],
    queryFn: () => facultyService.getById(id),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: 'ACTIVE',
      experience: 0,
    },
  });

  useEffect(() => {
    if (isEdit && existing?.data) {
      const f = existing.data;
      reset({
        employeeId:    f.employeeId,
        name:          f.name,
        email:         f.email,
        phone:         f.phone || '',
        designation:   f.designation,
        qualification: f.qualification,
        experience:    f.experience,
        specialization:f.specialization || '',
        joiningDate:   f.joiningDate ? f.joiningDate.slice(0, 10) : '',
        status:        f.status,
        username:      f.username,
      });
      if (f.photo) setPreview(f.photo);
    }
  }, [isEdit, existing, reset]);

  const createMutation = useMutation({
    mutationFn: facultyService.create,
    onSuccess: () => {
      toast.success('Faculty created successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/hod/faculty');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (fd) => facultyService.update(id, fd),
    onSuccess: () => {
      toast.success('Faculty updated successfully');
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      queryClient.invalidateQueries({ queryKey: ['faculty', id] });
      navigate('/hod/faculty');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') formData.append(k, v); });
    if (fileRef.current?.files[0]) formData.append('photo', fileRef.current.files[0]);
    if (isEdit) updateMutation.mutate(formData);
    else createMutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && loadingExisting) {
    return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/hod/faculty')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Faculty Management
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Faculty' : 'Add New Faculty'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Photo upload */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {preview
                ? <img src={preview.startsWith('http') || preview.startsWith('/') ? (preview.startsWith('/') ? `http://localhost:5000${preview}` : preview) : preview} alt="Preview" className="w-full h-full object-cover" />
                : <User size={32} className="text-gray-400" />
              }
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</p>
              <input type="file" ref={fileRef} onChange={handleFileChange} accept="image/*" className="hidden" id="photo-input" />
              <label htmlFor="photo-input">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer transition-colors">
                  <Upload size={14} /> Upload Photo
                </span>
              </label>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 5MB</p>
            </div>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Employee ID" required error={errors.employeeId?.message}>
              <input {...register('employeeId', { required: 'Required' })} className={clsx('input-field', errors.employeeId && 'border-red-400')} placeholder="EMP001" />
            </Field>

            <Field label="Full Name" required error={errors.name?.message}>
              <input {...register('name', { required: 'Required', maxLength: { value: 100, message: 'Too long' } })} className={clsx('input-field', errors.name && 'border-red-400')} placeholder="Dr. John Doe" />
            </Field>

            <Field label="Email" required error={errors.email?.message}>
              <input {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} type="email" className={clsx('input-field', errors.email && 'border-red-400')} placeholder="john@college.edu" />
            </Field>

            <Field label="Phone" error={errors.phone?.message}>
              <input {...register('phone')} className="input-field" placeholder="9876543210" />
            </Field>

            <Field label="Designation" required error={errors.designation?.message}>
              <input {...register('designation', { required: 'Required' })} className={clsx('input-field', errors.designation && 'border-red-400')} placeholder="Associate Professor" />
            </Field>

            <Field label="Qualification" required error={errors.qualification?.message}>
              <input {...register('qualification', { required: 'Required' })} className={clsx('input-field', errors.qualification && 'border-red-400')} placeholder="Ph.D Computer Science" />
            </Field>

            <Field label="Experience (years)" error={errors.experience?.message}>
              <input {...register('experience', { min: { value: 0, message: 'Min 0' }, max: { value: 60, message: 'Max 60' } })} type="number" className={clsx('input-field', errors.experience && 'border-red-400')} placeholder="5" />
            </Field>

            <Field label="Specialization" error={errors.specialization?.message}>
              <input {...register('specialization')} className="input-field" placeholder="Machine Learning" />
            </Field>

            <Field label="Joining Date" required error={errors.joiningDate?.message}>
              <input {...register('joiningDate', { required: 'Required' })} type="date" className={clsx('input-field', errors.joiningDate && 'border-red-400')} />
            </Field>

            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className="input-field">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </Field>

            {!isEdit && (
              <>
                <Field label="Username" required error={errors.username?.message}>
                  <input {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' }, pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, underscore only' } })} className={clsx('input-field', errors.username && 'border-red-400')} placeholder="john_doe" />
                </Field>

                <Field label="Password" required error={errors.password?.message}>
                  <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} type="password" className={clsx('input-field', errors.password && 'border-red-400')} placeholder="••••••••" />
                </Field>
              </>
            )}

            {isEdit && (
              <Field label="New Password" error={errors.password?.message}>
                <input {...register('password', { minLength: { value: 6, message: 'Min 6 chars' } })} type="password" className="input-field" placeholder="Leave blank to keep current" />
              </Field>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => navigate('/hod/faculty')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {isEdit ? 'Save Changes' : 'Add Faculty'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
