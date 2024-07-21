from flask import Flask, request, make_response, jsonify, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime, timedelta
from flask_cors import CORS
import logging
import secrets
from pytz import timezone
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, set_access_cookies
from models import db, User, Club, Event, Announcement, user_club

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.secret_key = secrets.token_urlsafe(16)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///teen_space.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = app.secret_key
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

jwt = JWTManager(app)
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response

# Home page
class Index(Resource):
    def get(self):
        response_dict = {"index": "Welcome to the Teen Space API"}
        return make_response(response_dict, 200)

api.add_resource(Index, '/')

# Sign up
class Register(Resource):
    def post(self):
        data = request.get_json()
        new_user = User(username=data['username'], password=data['password'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()

        response = make_response(
            jsonify({"id": new_user.id, "username": new_user.username}),
            201
        )
        response.headers['Content-Type'] = 'application/json'
        return response

api.add_resource(Register, '/register')

# Sign in
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if not user or user.password != data['password']:
            return make_response({'message': 'Invalid credentials'}, 401)

        session['user_id'] = user.id  # Set user ID in session
        response = {
            'user_id': user.id,
            'user': user.to_dict()
        }
        return make_response(jsonify(response), 200)

api.add_resource(Login, '/login')

# Protected resources
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.filter(User.id == user_id).first()
        if user:
            return user.to_dict(), 200
        return {}, 401

api.add_resource(ProtectedResource, '/protected')

# Logout
class Logout(Resource):
    @jwt_required()
    def delete(self):
        session.clear()
        response = make_response({"message": "Successfully logged out"}, 200)
        response.set_cookie('session', '', expires=0)  # Clear session cookie
        return response

api.add_resource(Logout, "/logout")

# Flask route for checking session
@app.route('/checksession', methods=['GET'])
@jwt_required()
def check_session():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(id=current_user).first()

        if user:
            return jsonify({'message': 'Session valid', 'user': user.to_dict()}), 200
        else:
            return jsonify({'message': 'User not found'}), 404

    except Exception as e:
        return jsonify({'message': 'Error checking session', 'error': str(e)}), 500

# List of clubs
class Clubs(Resource):
    def get(self):
        clubs = Club.query.all()
        return make_response([{"id": club.id, "name": club.name, "description": club.description} for club in clubs], 200)

    @jwt_required()
    def post(self):
        data = request.get_json()
        new_club = Club(name=data['name'], description=data['description'])
        db.session.add(new_club)
        db.session.commit()
        return make_response({"id": new_club.id, "name": new_club.name, "description": new_club.description}, 201)

api.add_resource(Clubs, '/clubs', endpoint='clubs_list')

# Find clubs by id (club when clicked)
class ClubByID(Resource):
    def get(self, club_id):
        club = Club.query.filter_by(id=club_id).first()
        if not club:
            return make_response({'message': 'Club not found'}, 404)

        events = Event.query.filter_by(club_id=club_id).all()
        announcements = Announcement.query.filter_by(club_id=club_id).all()

        club_data = {
            "id": club.id,
            "name": club.name,
            "description": club.description,
            "events": [{"id": e.id, "name": e.name, "date": e.date.isoformat()} for e in events],
            "announcements": [{"id": a.id, "content": a.content} for a in announcements]
        }
        return make_response(club_data, 200)

api.add_resource(ClubByID, '/clubs/<int:club_id>')

# User joining a club
class JoinClub(Resource):
    def post(self, club_id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'message': 'User not authenticated'}, 401)
        user = User.query.get(user_id)
        if not user:
            return make_response({'message': 'User not found'}, 404)
        club = Club.query.get_or_404(club_id)
        user.clubs.append(club)
        db.session.commit()
        return make_response({"message": "Joined club successfully"}, 200)

api.add_resource(JoinClub, '/clubs/<int:club_id>/join')

# User leaving a club
class LeaveClub(Resource):
    def post(self, club_id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'message': 'User not authenticated'}, 401)
        user = User.query.get(user_id)
        if not user:
            return make_response({'message': 'User not found'}, 404)
        club = Club.query.get_or_404(club_id)
        user.clubs.remove(club)
        db.session.commit()
        return make_response({"message": "Left club successfully"}, 200)

api.add_resource(LeaveClub, '/clubs/<int:club_id>/leave')

# List of events
@app.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()
    print("Received data:", data)
    name = data['name']
    date_str = data['date']
    club_id = data['club_id']

    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    club = Club.query.get(club_id)

    if club is None:
        return jsonify({'error': 'Club not found'}), 404
    event = Event(name=name, date=date_obj, club=club)
    db.session.add(event)
    db.session.commit()

    return jsonify({'message': 'Event created successfully'}), 201

#Deleting an Event by id
@app.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.get(id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'}), 200

@app.route('/events/<int:event_id>', methods=['PATCH'])
def update_event(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify({'error': 'Event not found'}), 404

    data = request.get_json()
    if 'name' in data:
        event.name = data['name']
    if 'date' in data:
        event.date = data['date']

    db.session.commit()
    return jsonify({'message': 'Event updated successfully'}), 200
# Find events by club
class ClubEvents(Resource):
    def get(self, club_id):
        events = Event.query.filter_by(club_id=club_id).all()
        return make_response([{"id": event.id, "name": event.name, "date": event.date.isoformat()} for event in events], 200)

api.add_resource(ClubEvents, '/clubs/<int:club_id>/events')

# List of announcements
@app.route("/announcements", methods=["POST"])
def create_announcement():
    data = request.get_json()
    print("Received data:", data)
    content = data['content']
    club_id = data['club_id']

    club = Club.query.get(club_id)
    if club is None:
        return jsonify({'error': 'Club not found'}), 404
    
    announcement = Announcement(content=content, club=club)
    db.session.add(announcement)
    db.session.commit()

    return jsonify({'message': 'Announcement created successfully'}), 201

# Deleting an Announcement
@app.route('/announcements/<int:id>', methods=['DELETE'])
def delete_announcement(id):
    announcement = Announcement.query.get(id)
    if not announcement:
        return jsonify({'message': 'Announcement not found'}), 404
    db.session.delete(announcement)
    db.session.commit()
    return jsonify({'message': 'Announcement deleted successfully'}), 200

# Updating an Announcement
@app.route('/announcements/<int:id>', methods=['PATCH'])
def update_announcement(id):
    announcement = Announcement.query.get(id)
    if not announcement:
        return jsonify({'message': 'Announcement not found'}), 404
    data = request.get_json()
    announcement.content = data['content']
    db.session.commit()
    return jsonify({'message': 'Announcement updated successfully'}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
