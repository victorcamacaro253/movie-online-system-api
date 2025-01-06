import schedule from 'node-schedule';
import Showtime from '../models/showtimes.js';

// Schedule a job to check and update showtime statuses every minute
schedule.scheduleJob('* * * * *', async () => {
    const now = new Date();

    try {
        // Mark showtimes as 'ongoing' if the current time is between start and end time
        await Showtime.updateMany(
            { start_time: { $lte: now }, end_time: { $gt: now }, status: 'upcoming' },
            { $set: { status: 'ongoing' } }
        );

        // Mark showtimes as 'completed' if the end time has passed
        await Showtime.updateMany(
            { end_time: { $lte: now }, status: { $in: ['upcoming', 'ongoing'] } },
            { $set: { status: 'completed' } }
        );

        console.log('Showtime statuses updated successfully!');
    } catch (error) {
        console.error('Error updating showtime statuses:', error);
    }
});
