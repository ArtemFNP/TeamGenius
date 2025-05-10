class TimeBlock {
    constructor(timeStart, timeFinish, activityType, location) {
        this.timeStart = timeStart; // Start time of the activity
        this.timeFinish = timeFinish; // End time of the activity
        this.activityType = activityType; // Type of activity (e.g., work, exercise, leisure)
        this.location = location; // Location where the activity takes place
    }
}


const timeBlocks = [
    new TimeBlock("08:00", "10:00", "indoor", "office"),
    new TimeBlock("12:30", "13:30", "indoor", "restaurant"),
    new TimeBlock("18:00", "19:30", "indoor", "gym")
];


