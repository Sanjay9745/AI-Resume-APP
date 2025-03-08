import apiUrl from './apiUrl';

export const getTemplates = async () => {
  try {
    const response = await fetch(`${apiUrl}/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const editTemplate = async (templateId: string, templateData: {
  name?: string;
  description?: string;
  image?: string;
  gradient?: [string, string];
}) => {
  try {
    const response = await fetch(`${apiUrl}/templates/${templateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update template');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};

export const createTemplate = async (templateData: {
  name: string;
  description: string;
  image: string;
  gradient: [string, string];
}) => {
  try {
    const response = await fetch(`${apiUrl}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      throw new Error('Failed to create template');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const seedInitialTemplate = async () => {
  const initialTemplate = {
    id: '1',
    name: 'Modern Professional',
    image: 'https://picsum.photos/400/600',
    description: 'Clean and modern',
    gradient: ['#4C6EF5', '#3B5BDB']
  };

  try {
    const response = await fetch(`${apiUrl}/templates/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initialTemplate),
    });

    if (!response.ok) {
      throw new Error('Failed to seed template');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error seeding template:', error);
    throw error;
  }
};