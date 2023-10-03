import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import '../App.css'; 

const ReservationForm = ({ reservations, onCreateReservation, onUpdate, initialData }) => {
    
    //Creates the default date time for the user form
    const defaultReservationDatetime = () => {
        const today = new Date();
        const defaultDate = new Date(today);
        defaultDate.setDate(today.getDate() + 2);
        defaultDate.setHours(18); 
        defaultDate.setMinutes(0); 
    
        const year = defaultDate.getFullYear();
        const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const day = String(defaultDate.getDate()).padStart(2, '0');
        const hours = String(defaultDate.getHours()).padStart(2, '0');
        const minutes = String(defaultDate.getMinutes()).padStart(2, '0');
    
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
        return formattedDateTime;
    };
    
    // Default form data
    const [formData, setFormData] = useState({
        reservation_datetime: defaultReservationDatetime(),
        reservation_first_name: '',
        reservation_last_name: '',
        phone_number: '',
        number_of_guests: 1
    });

    // Update form data when initialData changes for updating reservations
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
    
        // Capitalize the first letter of each word for first name and last name
        if (name === 'reservation_first_name' || name === 'reservation_last_name') {
            updatedValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
        }
    
        setFormData({
            ...formData,
            [name]: updatedValue
        });
    };

    const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate reservation_datetime
    const { reservation_datetime } = formData;
    if (!reservation_datetime) {
        alert('Reservation Date and Time is required.');
        return;
    }

    // Date and Time Validations
    const inputDate = new Date(reservation_datetime);
    const currentDate = new Date();

    // Checks whether the reservation date is at least 2 days after the current date
    const timeDifference = inputDate - currentDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (daysDifference < 2) {
        alert('Reservation date should be at least 2 days from the current date.');
        return;
    }

    // Checks whether the time is within the allowed range (6:00 pm to 9:30 pm)
    const inputTime = inputDate.getHours() * 100 + inputDate.getMinutes();
    if (inputTime < 1800 || inputTime > 2130) {
        alert('Reservation time should be between 6:00 pm and 9:30 pm.');
        return;
    }

    // Ensure time is divisible by 30 mins
    const minutes = inputDate.getMinutes();
    if (minutes % 30 !== 0) {
        alert('Reservation time should be divisible by 30 minutes.');
        return;
    }

    // Check if there are already 3 or more reservations for this datetime
    const existingReservations = reservations.filter(reservation => {
    const existingDate = new Date(reservation.reservation_datetime);
    const isSameDateTime = existingDate.getTime() === inputDate.getTime();

        // Check if the reservation being updated is one of the existing reservations for the same datetime
        const isUpdatingExistingReservation = initialData && reservation.id === initialData.id;

        return isSameDateTime && !isUpdatingExistingReservation;
    });

    if (existingReservations.length >= 3) {
        alert('There are already 3 reservations for this date and time. Please choose another date and time.');
        return;
    }

    // Validate other fields
    const { reservation_first_name, reservation_last_name, phone_number, number_of_guests } = formData;

    if (!reservation_first_name || !reservation_last_name || !phone_number || !number_of_guests) {
        alert('All fields are required.');
        return;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!nameRegex.test(reservation_first_name) || !nameRegex.test(reservation_last_name)) {
        alert('First name and last name should only contain letters and spaces.');
        return;
    }

    // Minimum and maximum number of guests
    if (number_of_guests < 1 || number_of_guests > 5) {
        alert('Number of guests should be between 1 and 5.');
        return;
    }

    const isPhoneNumberValid = /^(\+[0-9]{12,12}|0[0-9]{10,10})$/.test(phone_number);

    if (!isPhoneNumberValid) {
        alert('Phone number should start with "+" and have 12 numbers, or start with "0" and have 11 characters.');
        return;
    }

        // Check if this is a new reservation or an update
        if (initialData) {
            // Update existing reservation
            onUpdate(formData);
        } else {
            // Create a new reservation
            onCreateReservation(formData);
        }
        // Reset the form after submission
        setFormData({
            reservation_datetime: defaultReservationDatetime(),
            reservation_first_name: '',
            reservation_last_name: '',
            phone_number: '',
            number_of_guests: 1
        });
    };

    return (
        <Container  className="reservation-form">
            <h2 className="text-center">{initialData ? 'Update a Reservation' : 'Book a Reservation'}</h2>
            <Form onSubmit={handleFormSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="reservation_datetime">
                        <Form.Label>Reservation Date and Time:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="reservation_datetime"
                            value={formData.reservation_datetime}
                            onChange={handleFormChange}
                            title="Select the date and time for the reservation."
                            required
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="reservation_first_name">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="reservation_first_name"
                            value={formData.reservation_first_name}
                            onChange={handleFormChange}
                            title="Special characters or numbers are not allowed"
                            placeholder='e.g., Juan'
                            required
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="reservation_last_name">
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="reservation_last_name"
                            value={formData.reservation_last_name}
                            onChange={handleFormChange}
                            title="Special characters or numbers are not allowed"
                            placeholder='e.g., Dela Cruz'
                            required
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="phone_number">
                        <Form.Label>Phone Number:</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleFormChange}
                            title='Phone number should start with "+" and have 12 numbers, or start with "0" and have 11 numbers.'
                            placeholder='e.g., +639012345678 or 09123456789'
                            required
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="number_of_guests">
                        <Form.Label>Number of Guests:</Form.Label>
                        <Form.Control
                            type="number"
                            name="number_of_guests"
                            value={formData.number_of_guests}
                            onChange={handleFormChange}
                            min="1"
                            max="5"
                            title="Maximum number of guests is 5"
                            required
                        />
                    </Form.Group>
                </Row>
                <Row className="justify-content-center">
                    <Button type="submit" variant="primary" className="reservation-button">{initialData ? 'Update this Reservation' : 'Book this Reservation'}</Button>
                </Row>
            </Form>
        </Container>
    );
};

export default ReservationForm;