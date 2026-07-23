import { useState, useEffect } from 'react';
import courseApi from '../api/courseApi';

export default function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = () => {
    courseApi.getAllCourses()
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = (data) => courseApi.createCourse(data).then(res => {
    setCourses(prev => [...prev, res.data]);
    return res;
  });

  const updateCourse = (id, data) => courseApi.updateCourse(id, data).then(res => {
    setCourses(prev => prev.map(c => c.id === id ? res.data : c));
    return res;
  });

  const deleteCourse = (id) => courseApi.deleteCourse(id).then(() => {
    setCourses(prev => prev.filter(c => c.id !== id));
  });

  return { courses, loading, error, createCourse, updateCourse, deleteCourse, fetchCourses };
}
