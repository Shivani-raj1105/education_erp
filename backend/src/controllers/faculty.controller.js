const facultyService = require('../services/faculty.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const path = require('path');

const getFacultyList = async (req, res, next) => {
  try {
    const { items, pagination } = await facultyService.getFacultyList(
      req.user.departmentCode,
      req.query
    );
    return paginatedResponse(res, items, pagination);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await facultyService.getFacultyById(
      req.params.id,
      req.user.departmentCode
    );
    return successResponse(res, faculty);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

const createFaculty = async (req, res, next) => {
  try {
    // Handle photo upload
    if (req.file) {
      req.body.photo = `/uploads/photos/${req.file.filename}`;
    }

    const faculty = await facultyService.createFaculty(
      req.body,
      req.user.id,
      req.user.departmentCode
    );
    return successResponse(res, faculty, 'Faculty created successfully', 201);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

const updateFaculty = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.photo = `/uploads/photos/${req.file.filename}`;
    }

    const faculty = await facultyService.updateFaculty(
      req.params.id,
      req.body,
      req.user.id,
      req.user.departmentCode
    );
    return successResponse(res, faculty, 'Faculty updated successfully');
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

const deleteFaculty = async (req, res, next) => {
  try {
    const result = await facultyService.deleteFaculty(
      req.params.id,
      req.user.id,
      req.user.departmentCode
    );
    return successResponse(res, result);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { getFacultyList, getFacultyById, createFaculty, updateFaculty, deleteFaculty };
