# Runner App - Group Rides Feature

This feature allows Runner app users to create, join, and manage group rides with other car enthusiasts.

## Main Features

### 1. Group Rides List
- Display of upcoming and past rides
- Detailed information on each ride (date, location, participants, etc.)
- Visual indication of rides the user is registered for

### 2. Group Ride Creation
- Creation form with validation
- Definition of title, description, date, location, and maximum number of participants
- The user automatically becomes the organizer of the ride

### 3. Ride Details
- Complete display of ride information
- List of participants with their avatars
- Contextual actions according to user status (join, leave, cancel)
- Sharing the ride with other users

### 4. Participant Management
- Join an existing ride
- Leave a ride you're registered for
- Limitation of the number of participants according to the value defined by the organizer

## Technical Structure

### Data Models
- `GroupRide`: Represents a group ride with its properties
- Integration with existing `User` models

### Screens
- `GroupRideScreen`: List of group rides
- `CreateGroupRideScreen`: Creation of a new ride
- `GroupRideDetailsScreen`: Details of a specific ride

### Services
- API methods to retrieve, create, and manage rides
- Mock implementation for testing and development

## Usage

1. Access the group rides screen from the main navigation
2. View available rides or create a new ride
3. Join an existing ride or manage your participations
4. See the complete details of a ride and the participants

## Future Improvements

- Addition of notifications for ride updates
- Integration of maps to visualize the meeting location
- Comment system for participants
- Photo gallery to share images from the ride