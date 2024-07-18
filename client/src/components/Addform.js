import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

function Addform() {
    const formik = useFormik({
        initialValues: {
            announcement: '',
            club_id: '',
            date: '',
        },
    });

    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = JSON.stringify(formik.values);
            const response = await fetch('http://localhost:5000/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Include credentials such as cookies
                body: formData,
            });
            if (response.ok) {
                window.alert('Added Successfully');
                // Optionally, redirect to another page upon successful submission
            } else if (response.status === 401) {
                setError('Unauthorized: Please log in');
                // Optionally, redirect to login page or handle session expiration
            } else {
                setError('Failed to add data');
            }
        } catch (error) {
            setError('Failed to add data');
        }
    };
    return (
        <div className="addform">
            <div className="btn btn-back">
                <Link to="/mainpage">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </Link>
            </div>
            <div className="form-container starter">
                <form onSubmit={handleSubmit}>
                    <h1>New Announcement</h1>
                    <div className="form-group">
                        <input
                            id="announcement"
                            name="announcement"
                            type="text"
                            placeholder="New Announcement"
                            value={formik.values.announcement}
                            onChange={formik.handleChange}
                        />
                        <i className="fa-solid fa-bullhorn"></i>
                    </div>
                    <div className="form-group">
                        <input
                            id="club_id"
                            name="club_id"
                            type="number"
                            placeholder="Club ID"
                            value={formik.values.club_id}
                            onChange={formik.handleChange}
                        />
                        <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <div className="form-group">
                        <input
                            id="date"
                            name="date"
                            type="date"
                            placeholder="Date for the Announcement"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="btnn">
                        <button type="submit" className="add-btn">
                            Add
                        </button>
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Addform;