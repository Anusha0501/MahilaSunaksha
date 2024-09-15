from flask import Flask, request, jsonify
from flask_cors import CORS
import MySQLdb

app = Flask(__name__)
CORS(app) 

def get_db_connection():
    connection = MySQLdb.connect(
        host='localhost',
        user='root',
        password='Amanhulk@2003',
        database='safetyroutes'
    )
    return connection

@app.route('/report', methods=['POST'])
def submit_report():
    data = request.get_json()
    user_id = data.get('user_id')  # Assuming the user ID is passed from the front-end
    incident_type = data.get('type')
    location = data.get('location')
    description = data.get('description')

    if not user_id or not incident_type or not location or not description:
        return jsonify({'success': False, 'message': 'Missing data'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            'INSERT INTO reports (user_id, location, description) VALUES (%s, %s, %s)',
            (user_id, location, description)
        )
        connection.commit()
        return jsonify({'success': True})
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'success': False, 'message': 'Database error'}), 500
    finally:
        cursor.close()
        connection.close()


@app.route('/reports', methods=['GET'])
def get_reports():
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute('SELECT * FROM reports ORDER BY report_date DESC LIMIT 10')
        reports = cursor.fetchall()
        reports_list = [{
            'id': row[0],
            'type': row[1],
            'location': row[2],
            'description': row[3],
            'report_date': row[4].strftime('%Y-%m-%d %H:%M:%S')
        } for row in reports]
        return jsonify({'reports': reports_list})
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'reports': []}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
