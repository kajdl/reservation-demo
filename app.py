from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to get a new connection and create table if it doesn't exist
def get_db_connection():
    conn = sqlite3.connect('reservations.db')
    conn.row_factory = sqlite3.Row

    # Create the Reservations table if it doesn't exist
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Reservations (
            ID INTEGER PRIMARY KEY,
            reservation_datetime TIMESTAMP,
            reservation_first_name TEXT,
            reservation_last_name TEXT,
            phone_number TEXT,
            number_of_guests INTEGER
        )
    ''')
    cursor.close()
    return conn

# REST API routes
@app.route('/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    reservation_datetime = data.get('reservation_datetime')
    reservation_first_name = data.get('reservation_first_name')
    reservation_last_name = data.get('reservation_last_name')
    phone_number = data.get('phone_number')
    number_of_guests = data.get('number_of_guests')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO Reservations (reservation_datetime, reservation_first_name, reservation_last_name, phone_number, number_of_guests) VALUES (?, ?, ?, ?, ?)', 
                   (reservation_datetime, reservation_first_name, reservation_last_name, phone_number, number_of_guests))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Reservation created successfully'})

@app.route('/reservations', methods=['GET'])
def get_reservations():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Reservations')
    reservations = [{'ID': row[0], 'reservation_datetime': row[1], 'reservation_first_name': row[2], 
                     'reservation_last_name': row[3], 'phone_number': row[4], 'number_of_guests': row[5]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(reservations)

@app.route('/reservations/<int:id>', methods=['PUT'])
def update_reservation(id):
    data = request.get_json()
    reservation_datetime = data.get('reservation_datetime')
    reservation_first_name = data.get('reservation_first_name')
    reservation_last_name = data.get('reservation_last_name')
    phone_number = data.get('phone_number')
    number_of_guests = data.get('number_of_guests')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE Reservations SET reservation_datetime = ?, reservation_first_name = ?, reservation_last_name = ?, phone_number = ?, number_of_guests = ? WHERE ID = ?', 
                   (reservation_datetime, reservation_first_name, reservation_last_name, phone_number, number_of_guests, id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Reservation updated successfully'})

@app.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM Reservations WHERE ID = ?', (id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Reservation deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)