import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';

function AddAnnouncement() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      content: '',
      club: '',
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Required'),
      club: Yup.string().required('Required'),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      fetch('http://127.0.0.1:5000/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mode': 'no-cors',
        },
        body: JSON.stringify(values),
      })
      .then(response => {
        setSubmitting(false);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to create event');
        }
      })
      .then(data => {
        console.log('Success:', data);
        navigate('/mainpage');
      })
      .catch(error => {
        console.error('Error:', error);
        setErrors({ submit: error.message });
        window.alert("The announcement has been added to the TeenSpace Database")
        // navigate('/mainpage');
      });
    },
  });
  return (
    <div className="signup">
      <div className="btn btn-back">
        <Link to="/">
          <i className="fa-solid fa-arrow-left-long"></i>
        </Link>
      </div>
      <div className="form-container starter">
        <form onSubmit={formik.handleSubmit}>
          <h1>Add an announcement</h1>
          <h2 className="emoji">🎉</h2>
          <div className="form-group">
            <input
              id="content"
              name="content"
              type="text"
              placeholder="Content"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
            />
          </div>
          {formik.touched.content && formik.errors.content ? (
            <div className="error">{formik.errors.content}</div>
          ) : null}
          <div className="form-group">
            <input
              id="club"
              name="club"
              type="text"
              placeholder="Club ID"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.club}
            />
          </div>
          {formik.touched.club && formik.errors.club ? (
            <div className="error">{formik.errors.club}</div>
          ) : null}
          <div className="btnn">
            <button type="submit" className="login-btn" disabled={formik.isSubmitting}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAnnouncement;
