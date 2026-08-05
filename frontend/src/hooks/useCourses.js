import { useState, useEffect, useCallback } from 'react';
import courseApi from '../api/courseApi';
import { useAuth } from '../context/AuthContext';

// Le programme d'un cours dépend du rôle : l'admin/chef de projet voit tout,
// l'enseignant ne voit que les cours qui lui sont assignés, l'étudiant ne voit
// que les cours cochés pour lui (ou pour sa classe). Appeler systématiquement
// /courses (réservé à l'admin) faisait échouer le chargement pour les autres rôles.
export default function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(() => {
    if (!user?.id || !user?.role) {
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    let request;
    if (user.role === 'ADMIN' || user.role === 'CHEF_PROJET') {
      request = courseApi.getAllCourses();
    } else if (user.role === 'ENSEIGNANT') {
      request = courseApi.getCoursesByAssignedTo(user.id);
    } else if (user.role === 'ETUDIANT') {
      request = courseApi.getCoursesByEtudiant(user.id);
    } else {
      request = Promise.resolve({ data: [] });
    }
    return request
      .then((res) => {
        setCourses(res.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setCourses([]);
        setLoading(false);
      });
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (data) => {
    try {
      const res = await courseApi.createCourse(data);
      await fetchCourses();
      return res;
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.errorCode === 'ENSEIGNANT_DEJA_OCCUPE') {
        const customError = new Error('Cet enseignant est déjà occupé à cette plage horaire. Veuillez choisir un autre créneau.');
        customError.originalError = err;
        customError.isConflict = true;
        throw customError;
      }
      throw err;
    }
  };

  const updateCourse = async (id, data) => {
    try {
      const res = await courseApi.updateCourse(id, data);
      await fetchCourses();
      return res;
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.errorCode === 'ENSEIGNANT_DEJA_OCCUPE') {
        const customError = new Error('Cet enseignant est déjà occupé à cette plage horaire. Veuillez choisir un autre créneau.');
        customError.originalError = err;
        customError.isConflict = true;
        throw customError;
      }
      throw err;
    }
  };

  const deleteCourse = (id) => courseApi.deleteCourse(id).then(() => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  });

  const updateCourseStatus = (id, status) => courseApi.updateCourseStatus(id, status).then((res) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    return res;
  });

  return { 
    courses, 
    loading, 
    error, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    updateCourseStatus, 
    fetchCourses 
  };
}
