import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService, roleService } from '../services/faculty.service';
import toast from 'react-hot-toast';

/**
 * Reusable hook for faculty list with pagination/search/filter/sort.
 */
export function useFacultyList(params) {
  return useQuery({
    queryKey: ['faculty', params],
    queryFn: () => facultyService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

/**
 * Reusable hook for a single faculty record.
 */
export function useFaculty(id) {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: () => facultyService.getById(id),
    enabled: !!id,
  });
}

/**
 * Create faculty mutation with cache invalidation.
 */
export function useCreateFaculty(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: facultyService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['faculty'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Faculty created successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Create failed');
      options.onError?.(err);
    },
  });
}

/**
 * Update faculty mutation.
 */
export function useUpdateFaculty(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => facultyService.update(id, formData),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['faculty'] });
      qc.invalidateQueries({ queryKey: ['faculty', id] });
      toast.success('Faculty updated successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Update failed');
      options.onError?.(err);
    },
  });
}

/**
 * Delete faculty mutation.
 */
export function useDeleteFaculty(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => facultyService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['faculty'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Faculty deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Delete failed');
    },
  });
}

/**
 * Sync coordinator roles (context-menu bulk toggle).
 */
export function useSyncRoles(facultyId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ add, remove }) => roleService.sync(facultyId, { add, remove }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['faculty'] });
      qc.invalidateQueries({ queryKey: ['faculty', facultyId] });
      const r = data?.data?.results;
      if (r?.added?.length)   toast.success('Role assigned');
      if (r?.removed?.length) toast.success('Role removed');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Role update failed');
    },
  });
}
