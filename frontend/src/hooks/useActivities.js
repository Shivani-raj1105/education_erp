import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  technicalEventService,
  sportsActivityService,
  culturalActivityService,
  industryProjectService,
  hackathonService,
  otherCurricularService,
} from '../services/activities.service';
import toast from 'react-hot-toast';

// ─── Technical Events ─────────────────────────────────────────────────────────

export function useTechnicalEventList(params) {
  return useQuery({
    queryKey: ['technicalEvents', params],
    queryFn: () => technicalEventService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateTechnicalEvent(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: technicalEventService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['technicalEvents'] });
      toast.success('Technical event added successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add technical event');
      options.onError?.(err);
    },
  });
}

export function useUpdateTechnicalEvent(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => technicalEventService.update(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['technicalEvents'] });
      toast.success('Technical event updated successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update technical event');
      options.onError?.(err);
    },
  });
}

export function useDeleteTechnicalEvent(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => technicalEventService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['technicalEvents'] });
      toast.success('Technical event deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete technical event');
    },
  });
}

// ─── Sports Activities ────────────────────────────────────────────────────────

export function useSportsActivityList(params) {
  return useQuery({
    queryKey: ['sportsActivities', params],
    queryFn: () => sportsActivityService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateSportsActivity(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sportsActivityService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['sportsActivities'] });
      toast.success('Sports activity added successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add sports activity');
      options.onError?.(err);
    },
  });
}

export function useUpdateSportsActivity(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => sportsActivityService.update(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['sportsActivities'] });
      toast.success('Sports activity updated successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update sports activity');
      options.onError?.(err);
    },
  });
}

export function useDeleteSportsActivity(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => sportsActivityService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sportsActivities'] });
      toast.success('Sports activity deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete sports activity');
    },
  });
}

// ─── Cultural Activities ──────────────────────────────────────────────────────

export function useCulturalActivityList(params) {
  return useQuery({
    queryKey: ['culturalActivities', params],
    queryFn: () => culturalActivityService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateCulturalActivity(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: culturalActivityService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['culturalActivities'] });
      toast.success('Cultural activity added successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add cultural activity');
      options.onError?.(err);
    },
  });
}

export function useUpdateCulturalActivity(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => culturalActivityService.update(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['culturalActivities'] });
      toast.success('Cultural activity updated successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update cultural activity');
      options.onError?.(err);
    },
  });
}

export function useDeleteCulturalActivity(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => culturalActivityService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['culturalActivities'] });
      toast.success('Cultural activity deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete cultural activity');
    },
  });
}

// ─── Industry Projects ────────────────────────────────────────────────────────

export function useIndustryProjectList(params) {
  return useQuery({
    queryKey: ['industryProjects', params],
    queryFn: () => industryProjectService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateIndustryProject(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: industryProjectService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['industryProjects'] });
      toast.success('Project created successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
      options.onError?.(err);
    },
  });
}

export function useUpdateIndustryProject(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => industryProjectService.update(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['industryProjects'] });
      toast.success('Project updated successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update project');
      options.onError?.(err);
    },
  });
}

export function useDeleteIndustryProject(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => industryProjectService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['industryProjects'] });
      toast.success('Project deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    },
  });
}

export function useAddProjectStudent(projectId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => industryProjectService.addStudent(projectId, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['industryProjects'] });
      toast.success('Student added to project');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add student');
    },
  });
}

export function useRemoveProjectStudent(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, studentId }) => industryProjectService.removeStudent(projectId, studentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['industryProjects'] });
      toast.success('Student removed');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove student');
    },
  });
}

// ─── Hackathons ───────────────────────────────────────────────────────────────

export function useHackathonList(params) {
  return useQuery({
    queryKey: ['hackathons', params],
    queryFn: () => hackathonService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateHackathon(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hackathonService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['hackathons'] });
      toast.success('Hackathon record added');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add record');
      options.onError?.(err);
    },
  });
}

export function useUpdateHackathon(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => hackathonService.update(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['hackathons'] });
      toast.success('Hackathon record updated');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update record');
      options.onError?.(err);
    },
  });
}

export function useDeleteHackathon(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => hackathonService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hackathons'] });
      toast.success('Hackathon record deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete record');
    },
  });
}

// ─── Other Curricular Activities ──────────────────────────────────────────────

export function useOtherCurricularList(params) {
  return useQuery({
    queryKey: ['otherCurricular', params],
    queryFn: () => otherCurricularService.getAll(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateOtherCurricular(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: otherCurricularService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['otherCurricular'] });
      toast.success('Record added successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add record');
      options.onError?.(err);
    },
  });
}

export function useUpdateOtherCurricular(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => otherCurricularService.update(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['otherCurricular'] });
      toast.success('Record updated successfully');
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update record');
      options.onError?.(err);
    },
  });
}

export function useDeleteOtherCurricular(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => otherCurricularService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['otherCurricular'] });
      toast.success('Record deleted');
      options.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete record');
    },
  });
}
