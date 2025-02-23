import axios from 'axios';
import apiUrl from './apiUrl';

interface ChatRequest {
    message: string;
    sessionId?: string;
    isChat?: boolean;
    isSubmit?: boolean;
    templateId?: string;
}

interface ChatResponse {
    success: boolean;
    result: {
        chatMessage: string;
        path: string | undefined;
        sessionId: string;
        formJSONSpec?: any;
        message?: string;
        messages?: any[];
        timestamp: string;
        error: null | string;
        resumePath?: string;
        isChat?: boolean;
    };
}

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
    try {
        const response = await axios.post<ChatResponse>(apiUrl + '/chat', {
            ...request,
            templateId: request.templateId
        });
        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};