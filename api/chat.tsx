import apiUrl from './apiUrl';

interface ChatRequest {
	message: string;
	sessionId?: string;
	isChat?: boolean;
	isSubmit?: boolean;
	isPreview?: boolean;
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

export const sendChatMessage = async ({
	message,
	sessionId,
	isChat = true,
	isSubmit = false,
	isPreview = false,
	templateId
}: ChatRequest): Promise<ChatResponse> => {
	try {
		const endpoint = isChat ? 'chat' : 'form';
		const url = `${apiUrl}/${endpoint}`;
		
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message,
				sessionId,
				isSubmit,
				isPreview,
				templateId
			}),
		});
		
		const data = await response.json();
		
		if (!data.success) {
			throw new Error(data.message || 'Failed to send message');
		}
		
		return data;
	} catch (error) {
		console.error('Error sending chat message:', error);
		throw error;
	}
};

export const getResumePreview = async (sessionId: string, jsonData: Object): Promise<ChatResponse> => {
	try {
		const url = `${apiUrl}/chat/resume/preview`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sessionId,
				jsonData
			})
		});

		const data = await response.json();

		if (!data.success) {
			throw new Error(data.message || 'Failed to get resume preview');
		}

		return data;
	} catch (error) {
		console.error('Error getting resume preview:', error);
		throw error;
	}
}

export const generateResumePDF = async (sessionId: string, jsonData: Object): Promise<ChatResponse> => {
	try {
		const url = `${apiUrl}/chat/resume/pdf`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sessionId,
				jsonData
			})
		});

		const data = await response.json();

		if (!data.success) {
			throw new Error(data.message || 'Failed to generate resume PDF');
		}

		return data;
	} catch (error) {
		console.error('Error generating resume PDF:', error);
		throw error;
	}
}