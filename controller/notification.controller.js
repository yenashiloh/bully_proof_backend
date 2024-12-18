const db = require('../config/db');
const { Types } = require('mongoose');

const getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;

        const notifications = db.collection('notifications');

        const query = {};
        if (userId) {
            query.userId = new Types.ObjectId(userId);
        }

        const results = await notifications
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notifications = db.collection('notifications');

        const result = await notifications.updateOne(
            { _id: new Types.ObjectId(notificationId) },
            {
                $set: {
                    status: 'read',
                    readAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            status: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        // Log the full user object to see what's available
        console.log('Full req.user object:', req.user);

        // Verify exactly how the user ID is being extracted
        const userId = req.user.id || req.user._id || req.user.userId;
        console.log('Extracted User ID:', userId);

        // Convert to string and ObjectId to ensure correct type
        const userObjectId = new Types.ObjectId(userId.toString());
        console.log('Converted User ObjectId:', userObjectId);

        const notifications = db.collection('notifications');

        // Log the exact query conditions
        const query = {
            userId: userObjectId,
            status: 'unread'
        };
        console.log('Query Conditions:', query);

        // Find unread notifications for this user
        const unreadNotifications = await notifications.find(query).toArray();
        console.log('Unread Notifications Found:', unreadNotifications);

        const result = await notifications.updateMany(query, {
            $set: {
                status: 'read',
                readAt: new Date()
            }
        });

        console.log('Update Result:', {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });

        res.status(200).json({
            status: true,
            message: `${result.modifiedCount} notifications marked as read`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            unreadNotificationsCount: unreadNotifications.length
        });
    } catch (error) {
        console.error('Error in markAllNotificationsAsRead:', error);
        res.status(500).json({
            status: false,
            message: 'Error marking all notifications as read',
            error: error.toString()
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notifications = db.collection('notifications');

        const result = await notifications.deleteOne({
            _id: new Types.ObjectId(notificationId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            status: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};