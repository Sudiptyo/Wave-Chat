interface createConversationData {
    creatorId: string;
    name: string;
    conversationType: "PRIVATE" | "GROUP";
    participantIds: string[];
}

interface getConversationsData {
    userId: string;
}

interface updateConversationData {
    conversationId: string;
    userId: string;
}

interface deleteConversationData {
    conversationId: string;
    userId: string;
}

interface pinConversationData {
    conversationId: string;
    userId: string;
}

interface unpinConversationData {
    conversationId: string;
    userId: string;
}

interface muteConversationData {
    conversationId: string;
    userId: string;
    muteType: "HOURS_24" | "HOURS_48" | "ALWAYS" | "CUSTOM";
    muteUntil?: Date;
}

interface unmuteConversationData {
    conversationId: string;
    userId: string;
}

interface archiveConversationData {
    conversationId: string;
    userId: string;
}

interface unarchiveConversationData {
    conversationId: string;
    userId: string;
}


export { createConversationData, getConversationsData, updateConversationData, deleteConversationData, pinConversationData, unpinConversationData, muteConversationData, unmuteConversationData, archiveConversationData, unarchiveConversationData };