interface friendRequestData {
    senderId: string;
    identifier: string;
    message?: string;
}

interface acceptFriendRequestData {
    requestId: string;
    receiverId: string;
}

interface rejectFriendRequestData {
    requestId: string;
    receiverId: string;
}

export {
    friendRequestData,
    acceptFriendRequestData,
    rejectFriendRequestData,
};