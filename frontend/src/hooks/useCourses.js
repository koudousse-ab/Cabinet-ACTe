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

  const createCourse = (data) => courseApi.createCourse(data).then((res) => {
    fetchCourses();
    return res;
  });

  const updateCourse = (id, data) => courseApi.updateCourse(id, data).then((res) => {
    fetchCourses();
    return res;
  });

  const deleteCourse = (id) => courseApi.deleteCourse(id).then(() => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  });

  const updateCourseStatus = (id, status) => courseApi.updateCourseStatus(id, status).then((res) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    return res;
  });

  return { courses, loading, error, createCourse, updateCourse, deleteCourse, updateCourseStatus, fetchCourses };
}
