// AI Service for handling AI tutor interactions
// Currently using mock data until AI service backend is implemented

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  suggestedConcepts?: string[];
  timestamp?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface MockTestRequest {
  conceptId: string;
  numberOfQuestions: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface MockTestResponse {
  quizId: string;
  title: string;
  questions: Question[];
  estimatedTime?: number;
  difficulty?: "easy" | "medium" | "hard";
}

/**
 * Sends a message to the AI tutor and receives a response
 * Currently returns mock data - echoes the user's message
 *
 * @param message - The user's question or message to the AI tutor
 * @returns Promise<ChatResponse> - The AI's response with optional suggested concepts
 */
export const sendChatMessage = async (
  message: string
): Promise<ChatResponse> => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response - echoing the user's message for now
    const mockResponse: ChatResponse = {
      response: `You asked: "${message}". This is a mock response. The AI service will provide a detailed answer once implemented.`,
      suggestedConcepts: [
        "Related Concept 1",
        "Related Concept 2",
        "Related Concept 3",
      ],
      timestamp: new Date().toISOString(),
    };

    return mockResponse;

    // TODO: Replace with actual API call when backend is ready
    /*
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
    */
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw new Error("Failed to send message to AI tutor");
  }
};

/**
 * Alternative function for when you want to implement the actual API call
 * This is commented out but ready to use when your backend is implemented
 */
export const sendChatMessageToAPI = async (
  message: string
): Promise<ChatResponse> => {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling AI chat API:", error);
    throw error;
  }
};

/**
 * Generates a new mock test based on a specific concept
 * Calls the Lerniqo Custom Gem API to create a dynamic quiz
 *
 * @param conceptId - The ID of the concept to generate questions for
 * @param numberOfQuestions - Number of questions to include in the test (default: 10)
 * @returns Promise<MockTestResponse> - The generated quiz with questions
 */
export const generateNewMockTest = async (
  conceptId: string,
  numberOfQuestions: number = 10
): Promise<MockTestResponse> => {
  try {
    // Validate input parameters
    if (!conceptId || conceptId.trim().length === 0) {
      throw new Error("Concept ID is required to generate a mock test");
    }

    if (numberOfQuestions < 1 || numberOfQuestions > 50) {
      throw new Error("Number of questions must be between 1 and 50");
    }

    // Simulate API call delay for now
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response with realistic questions until the actual API is implemented
    const mockQuestions = [
      {
        id: `q1-${conceptId}`,
        question:
          "What is the primary function of chloroplasts in plant cells?",
        options: [
          "To store genetic material and control cell activities",
          "To convert sunlight into chemical energy through photosynthesis",
          "To break down waste materials and toxins",
          "To provide structural support to the cell",
        ],
        correctAnswer: 1,
        explanation:
          "Chloroplasts are specialized organelles found in plant cells that contain chlorophyll. Their primary function is to conduct photosynthesis, the process by which light energy is converted into chemical energy (glucose) using carbon dioxide and water. This process is essential for plant survival and oxygen production.",
      },
      {
        id: `q2-${conceptId}`,
        question: "Which of the following best describes mitosis?",
        options: [
          "The process of energy production in cells",
          "The division of a cell's nucleus to produce two identical diploid cells",
          "The breakdown of glucose to release energy",
          "The formation of gametes with half the chromosome number",
        ],
        correctAnswer: 1,
        explanation:
          "Mitosis is the process of nuclear division that results in two genetically identical daughter cells, each having the same number of chromosomes as the parent cell. This is different from meiosis, which produces gametes with half the chromosome number. Mitosis is crucial for growth, repair, and asexual reproduction.",
      },
      {
        id: `q3-${conceptId}`,
        question: "What is the chemical formula for water?",
        options: ["H₂O₂", "H₂O", "HO₂", "H₃O"],
        correctAnswer: 1,
        explanation:
          "Water has the chemical formula H₂O, meaning each molecule consists of two hydrogen atoms covalently bonded to one oxygen atom. This simple yet essential compound is vital for all known forms of life and has unique properties like high specific heat capacity and the ability to dissolve many substances.",
      },
      {
        id: `q4-${conceptId}`,
        question: "Which gas makes up approximately 78% of Earth's atmosphere?",
        options: [
          "Oxygen (O₂)",
          "Carbon dioxide (CO₂)",
          "Nitrogen (N₂)",
          "Argon (Ar)",
        ],
        correctAnswer: 2,
        explanation:
          "Nitrogen (N₂) makes up approximately 78% of Earth's atmosphere, making it the most abundant gas. Oxygen comprises about 21%, while carbon dioxide and other gases make up the remaining 1%. Nitrogen is essential for protein synthesis and is cycled through ecosystems via the nitrogen cycle.",
      },
      {
        id: `q5-${conceptId}`,
        question: "What is the speed of light in a vacuum?",
        options: [
          "299,792,458 meters per second",
          "300,000,000 meters per second",
          "299,800,000 meters per second",
          "298,000,000 meters per second",
        ],
        correctAnswer: 0,
        explanation:
          "The speed of light in a vacuum is exactly 299,792,458 meters per second (approximately 300,000 km/s). This is a fundamental physical constant denoted by 'c' and represents the maximum speed at which all matter and information can travel. It's crucial in Einstein's theory of relativity.",
      },
      {
        id: `q6-${conceptId}`,
        question: "Which organelle is responsible for protein synthesis?",
        options: ["Mitochondria", "Ribosomes", "Golgi apparatus", "Lysosomes"],
        correctAnswer: 1,
        explanation:
          "Ribosomes are the cellular organelles responsible for protein synthesis (translation). They read messenger RNA (mRNA) and assemble amino acids into proteins according to the genetic code. Ribosomes can be found free in the cytoplasm or attached to the endoplasmic reticulum.",
      },
      {
        id: `q7-${conceptId}`,
        question: "What is the pH value of pure water at 25°C?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation:
          "Pure water at 25°C has a pH of 7, which is considered neutral. The pH scale ranges from 0-14, where values below 7 are acidic, 7 is neutral, and values above 7 are basic (alkaline). This neutrality occurs because pure water has equal concentrations of H⁺ and OH⁻ ions.",
      },
      {
        id: `q8-${conceptId}`,
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2,
        explanation:
          "Mars is known as the 'Red Planet' due to its reddish appearance, which is caused by iron oxide (rust) on its surface. Mars is the fourth planet from the Sun and has been a subject of intense scientific study due to evidence of past water activity and potential for past or present life.",
      },
      {
        id: `q9-${conceptId}`,
        question:
          "What is the process by which plants lose water vapor through their leaves?",
        options: ["Photosynthesis", "Respiration", "Transpiration", "Osmosis"],
        correctAnswer: 2,
        explanation:
          "Transpiration is the process by which plants lose water vapor through small openings called stomata, primarily located on the underside of leaves. This process helps cool the plant, transport nutrients from roots to leaves, and maintain proper water balance. It's an essential part of the water cycle.",
      },
      {
        id: `q10-${conceptId}`,
        question:
          "Which scientist proposed the theory of evolution by natural selection?",
        options: [
          "Gregor Mendel",
          "Charles Darwin",
          "Louis Pasteur",
          "Marie Curie",
        ],
        correctAnswer: 1,
        explanation:
          "Charles Darwin proposed the theory of evolution by natural selection in his 1859 book 'On the Origin of Species.' This theory explains how species change over time through the differential survival and reproduction of individuals with favorable traits. It revolutionized our understanding of life on Earth.",
      },
    ];

    // Select the requested number of questions from the pool
    const selectedQuestions = mockQuestions.slice(
      0,
      Math.min(numberOfQuestions, mockQuestions.length)
    );

    const mockTest: MockTestResponse = {
      quizId: `mock-quiz-${Date.now()}`,
      title: `Mock Test: ${conceptId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())}`,
      estimatedTime: numberOfQuestions * 2, // 2 minutes per question
      difficulty: "medium",
      questions: selectedQuestions,
    };

    return mockTest;

    // TODO: Replace with actual API call when backend is ready
    /*
    const response = await fetch('/api/ai/generate-mock-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        conceptId, 
        numberOfQuestions 
      }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: MockTestResponse = await response.json();
    return data;
    */
  } catch (error) {
    console.error("Error generating mock test:", error);
    throw new Error("Failed to generate mock test");
  }
};

/**
 * Alternative function for when you want to implement the actual API call
 * This is ready to use when your Lerniqo Custom Gem backend is implemented
 */
export const generateMockTestFromAPI = async (
  conceptId: string,
  numberOfQuestions: number = 10
): Promise<MockTestResponse> => {
  try {
    const response = await fetch("/api/ai/generate-mock-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conceptId,
        numberOfQuestions,
      }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: MockTestResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling mock test generation API:", error);
    throw error;
  }
};

/**
 * Utility function to validate mock test parameters
 */
export const validateMockTestParams = (
  conceptId: string,
  numberOfQuestions: number
): { isValid: boolean; error?: string } => {
  if (!conceptId || conceptId.trim().length === 0) {
    return { isValid: false, error: "Concept ID is required" };
  }

  if (numberOfQuestions < 1 || numberOfQuestions > 50) {
    return {
      isValid: false,
      error: "Number of questions must be between 1 and 50",
    };
  }

  return { isValid: true };
};

/**
 * Utility function to validate chat messages
 */
export const validateChatMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.length <= 1000;
};

/**
 * Mock data for testing - different response variations
 */
export const getMockResponse = (message: string): ChatResponse => {
  const responses = [
    {
      response: `Great question! You asked about: "${message}". Here's what I can help you understand...`,
      suggestedConcepts: ["Concept A", "Concept B", "Concept C"],
    },
    {
      response: `I see you're interested in: "${message}". Let me break this down for you...`,
      suggestedConcepts: ["Topic 1", "Topic 2", "Topic 3"],
    },
    {
      response: `Excellent! Your question about "${message}" is very insightful. Here's my explanation...`,
      suggestedConcepts: ["Related Area 1", "Related Area 2"],
    },
  ];

  const randomIndex = Math.floor(Math.random() * responses.length);
  return {
    ...responses[randomIndex],
    timestamp: new Date().toISOString(),
  };
};

/**
 * Interface for the learning path request
 */
export interface LearningPathRequest {
  userId: string;
}

/**
 * Interface for concept in learning path
 */
export interface Concept {
  conceptId: string;
  name: string;
}

/**
 * Interface for learning path response
 */
export interface LearningPathResponse {
  recommendedNext: Concept;
  currentProgress?: {
    completedConcepts: string[];
    inProgressConcepts: string[];
    totalConcepts: number;
    progressPercentage: number;
  };
  learningPath: Concept[];
  adaptiveRecommendations?: {
    weakAreas: Concept[];
    strengthAreas: Concept[];
    suggestedReview: Concept[];
  };
}

/**
 * Generates a personalized learning path for a user
 * This is an internal endpoint called by other services (primarily the Content Service)
 * to get the computed learning path for a user.
 *
 * @param userId - The UUID of the student user
 * @returns Promise<LearningPathResponse> - The structured learning path data
 */
export const generateLearningPath = async (
  userId: string
): Promise<LearningPathResponse> => {
  try {
    // Validate input
    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID is required to generate learning path");
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get user's current progress from storage (in real app, this would come from server)
    const userProgress = getUserProgress(userId);

    // Mock learning path data based on the syllabus structure and user progress
    const mockLearningPath: LearningPathResponse = {
      recommendedNext: {
        conceptId: "PAR001",
        name: "Fraction Multiplication",
      },
      currentProgress: {
        completedConcepts: userProgress.completedConcepts,
        inProgressConcepts: userProgress.inProgressConcepts,
        totalConcepts: userProgress.totalConcepts,
        progressPercentage: Math.round(
          (userProgress.completedConcepts.length / userProgress.totalConcepts) *
            100
        ),
      },
      learningPath: [
        {
          conceptId: "PAR001",
          name: "Fraction Multiplication",
        },
        {
          conceptId: "PAR002",
          name: "Understanding 'Of' Means Multiply",
        },
        {
          conceptId: "PAR003",
          name: "Fraction Division",
        },
        {
          conceptId: "PAR004",
          name: "Understanding Reciprocals",
        },
        {
          conceptId: "PAR005",
          name: "Comparing Fractions",
        },
        {
          conceptId: "PAR006",
          name: "Simplifying Fractions",
        },
        {
          conceptId: "PAR007",
          name: "Equivalent Fractions, Decimals, and Percents",
        },
        {
          conceptId: "PAR008",
          name: "Converting Between Fractions, Decimals, and Percents",
        },
        {
          conceptId: "PAR009",
          name: "General Fractions Concepts",
        },
        {
          conceptId: "PAR010",
          name: "Finding Percentages",
        },
      ],
      adaptiveRecommendations: {
        weakAreas: [
          {
            conceptId: "PAR026",
            name: "Order of Operations",
          },
          {
            conceptId: "PAR027",
            name: "Applying Order of Operations",
          },
        ],
        strengthAreas: [
          {
            conceptId: "PAR019",
            name: "Addition",
          },
          {
            conceptId: "PAR023",
            name: "Multiplication",
          },
        ],
        suggestedReview: [
          {
            conceptId: "PAR025",
            name: "Division",
          },
          {
            conceptId: "PAR024",
            name: "Simple Multiplication Applications",
          },
        ],
      },
    };

    return mockLearningPath;

    // TODO: Replace with actual API call when backend is ready
    /*
    const response = await fetch('/api/ai/internal/generate-learning-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`, // Service-to-service token
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: LearningPathResponse = await response.json();
    return data;
    */
  } catch (error) {
    console.error("Error generating learning path:", error);
    throw new Error("Failed to generate learning path for user");
  }
};

/**
 * Alternative function for when you want to implement the actual API call
 * This is ready to use when your backend learning path service is implemented
 */
export const generateLearningPathFromAPI = async (
  userId: string
): Promise<LearningPathResponse> => {
  try {
    const response = await fetch("/api/ai/internal/generate-learning-path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`, // Service-to-service auth
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: LearningPathResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling learning path generation API:", error);
    throw error;
  }
};

/**
 * Interface for marking concept completion
 */
export interface MarkConceptCompleteRequest {
  userId: string;
  conceptId: string;
  completedAt?: string;
  timeSpent?: number; // in minutes
  score?: number; // percentage score if applicable
}

export interface MarkConceptCompleteResponse {
  success: boolean;
  message: string;
  updatedProgress?: {
    completedConcepts: string[];
    progressPercentage: number;
  };
}

/**
 * Interface for starting a concept (marking as in-progress)
 */
export interface StartConceptRequest {
  userId: string;
  conceptId: string;
  startedAt?: string;
}

export interface StartConceptResponse {
  success: boolean;
  message: string;
  updatedProgress?: {
    inProgressConcepts: string[];
  };
}

/**
 * Interface for marking concept as undone (incomplete)
 */
export interface MarkConceptUndoneRequest {
  userId: string;
  conceptId: string;
  uncompletedAt?: string;
  reason?: string; // Optional reason for marking as undone
}

export interface MarkConceptUndoneResponse {
  success: boolean;
  message: string;
  updatedProgress?: {
    completedConcepts: string[];
    inProgressConcepts: string[];
    progressPercentage: number;
  };
}

/**
 * Mark a concept as completed for a user
 * This updates the user's progress and recalculates their learning path
 *
 * @param request - The completion request with user and concept details
 * @returns Promise<MarkConceptCompleteResponse> - Success status and updated progress
 */
export const markConceptComplete = async (
  request: MarkConceptCompleteRequest
): Promise<MarkConceptCompleteResponse> => {
  try {
    // Validate input
    if (!request.userId || !request.conceptId) {
      throw new Error("Both userId and conceptId are required");
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock success response - in a real app, this would update the database
    const mockResponse: MarkConceptCompleteResponse = {
      success: true,
      message: `Concept ${request.conceptId} marked as completed successfully!`,
      updatedProgress: {
        completedConcepts: [
          // Mock: add the completed concept to existing completed concepts
          "PAR019",
          "PAR020",
          "PAR021",
          "PAR022",
          "PAR023",
          "PAR024",
          "PAR025",
          request.conceptId,
        ],
        progressPercentage: 12.5, // Mock: increased progress
      },
    };

    // Store in localStorage for demo purposes (in real app, this would be server-side)
    const storageKey = `user_progress_${request.userId}`;
    const existingProgress = localStorage.getItem(storageKey);
    let progress = existingProgress
      ? JSON.parse(existingProgress)
      : {
          completedConcepts: [
            "PAR019",
            "PAR020",
            "PAR021",
            "PAR022",
            "PAR023",
            "PAR024",
            "PAR025",
          ],
          inProgressConcepts: ["PAR026", "PAR027"],
          totalConcepts: 102,
        };

    // Add to completed and remove from in-progress
    if (!progress.completedConcepts.includes(request.conceptId)) {
      progress.completedConcepts.push(request.conceptId);
    }
    progress.inProgressConcepts = progress.inProgressConcepts.filter(
      (id: string) => id !== request.conceptId
    );

    // Update progress percentage
    progress.progressPercentage = Math.round(
      (progress.completedConcepts.length / progress.totalConcepts) * 100
    );

    localStorage.setItem(storageKey, JSON.stringify(progress));

    return {
      ...mockResponse,
      updatedProgress: {
        completedConcepts: progress.completedConcepts,
        progressPercentage: progress.progressPercentage,
      },
    };

    // TODO: Replace with actual API call when backend is ready
    /*
    const response = await fetch('/api/user/progress/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: MarkConceptCompleteResponse = await response.json();
    return data;
    */
  } catch (error) {
    console.error("Error marking concept as complete:", error);
    throw new Error("Failed to mark concept as completed");
  }
};

/**
 * Start a concept (mark as in-progress) for a user
 *
 * @param request - The start concept request
 * @returns Promise<StartConceptResponse> - Success status and updated progress
 */
export const startConcept = async (
  request: StartConceptRequest
): Promise<StartConceptResponse> => {
  try {
    // Validate input
    if (!request.userId || !request.conceptId) {
      throw new Error("Both userId and conceptId are required");
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Store in localStorage for demo purposes
    const storageKey = `user_progress_${request.userId}`;
    const existingProgress = localStorage.getItem(storageKey);
    let progress = existingProgress
      ? JSON.parse(existingProgress)
      : {
          completedConcepts: [
            "PAR019",
            "PAR020",
            "PAR021",
            "PAR022",
            "PAR023",
            "PAR024",
            "PAR025",
          ],
          inProgressConcepts: ["PAR026", "PAR027"],
          totalConcepts: 102,
        };

    // Add to in-progress if not already there and not completed
    if (
      !progress.inProgressConcepts.includes(request.conceptId) &&
      !progress.completedConcepts.includes(request.conceptId)
    ) {
      progress.inProgressConcepts.push(request.conceptId);
    }

    localStorage.setItem(storageKey, JSON.stringify(progress));

    return {
      success: true,
      message: `Started learning concept ${request.conceptId}`,
      updatedProgress: {
        inProgressConcepts: progress.inProgressConcepts,
      },
    };
  } catch (error) {
    console.error("Error starting concept:", error);
    throw new Error("Failed to start concept");
  }
};

/**
 * Mark a concept as undone (incomplete) for a user
 * This removes the concept from completed list and optionally adds it back to in-progress
 *
 * @param request - The undone request with user and concept details
 * @returns Promise<MarkConceptUndoneResponse> - Success status and updated progress
 */
export const markConceptUndone = async (
  request: MarkConceptUndoneRequest
): Promise<MarkConceptUndoneResponse> => {
  try {
    // Validate input
    if (!request.userId || !request.conceptId) {
      throw new Error("Both userId and conceptId are required");
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Store in localStorage for demo purposes
    const storageKey = `user_progress_${request.userId}`;
    const existingProgress = localStorage.getItem(storageKey);
    let progress = existingProgress
      ? JSON.parse(existingProgress)
      : {
          completedConcepts: [
            "PAR019",
            "PAR020",
            "PAR021",
            "PAR022",
            "PAR023",
            "PAR024",
            "PAR025",
          ],
          inProgressConcepts: ["PAR026", "PAR027"],
          totalConcepts: 102,
        };

    // Remove from completed concepts
    progress.completedConcepts = progress.completedConcepts.filter(
      (id: string) => id !== request.conceptId
    );

    // Add back to in-progress if not already there
    if (!progress.inProgressConcepts.includes(request.conceptId)) {
      progress.inProgressConcepts.push(request.conceptId);
    }

    // Update progress percentage
    progress.progressPercentage = Math.round(
      (progress.completedConcepts.length / progress.totalConcepts) * 100
    );

    localStorage.setItem(storageKey, JSON.stringify(progress));

    return {
      success: true,
      message: `Concept ${request.conceptId} marked as incomplete and moved back to in-progress`,
      updatedProgress: {
        completedConcepts: progress.completedConcepts,
        inProgressConcepts: progress.inProgressConcepts,
        progressPercentage: progress.progressPercentage,
      },
    };

    // TODO: Replace with actual API call when backend is ready
    /*
    const response = await fetch('/api/user/progress/undone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: MarkConceptUndoneResponse = await response.json();
    return data;
    */
  } catch (error) {
    console.error("Error marking concept as undone:", error);
    throw new Error("Failed to mark concept as undone");
  }
};

/**
 * Get user progress from storage (for demo purposes)
 * In a real app, this would fetch from the server
 */
export const getUserProgress = (userId: string) => {
  const storageKey = `user_progress_${userId}`;
  const existingProgress = localStorage.getItem(storageKey);

  if (existingProgress) {
    return JSON.parse(existingProgress);
  }

  // Default progress for demo
  const defaultProgress = {
    completedConcepts: [
      "PAR019",
      "PAR020",
      "PAR021",
      "PAR022",
      "PAR023",
      "PAR024",
      "PAR025",
    ],
    inProgressConcepts: ["PAR026", "PAR027"],
    totalConcepts: 102,
    progressPercentage: 8.8,
  };

  localStorage.setItem(storageKey, JSON.stringify(defaultProgress));
  return defaultProgress;
};

/**
 * Utility function to validate learning path request parameters
 */
export const validateLearningPathRequest = (
  userId: string
): { isValid: boolean; error?: string } => {
  if (!userId || userId.trim().length === 0) {
    return { isValid: false, error: "User ID is required" };
  }

  // Basic UUID format validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return { isValid: false, error: "Invalid user ID format" };
  }

  return { isValid: true };
};

/**
 * Mock function to simulate different learning path scenarios based on user progress
 */
export const getMockLearningPathForUser = (
  userId: string
): LearningPathResponse => {
  // Simulate different learning paths based on userId for testing
  const scenarios = [
    // Beginner - just starting with numbers
    {
      recommendedNext: {
        conceptId: "PAR019",
        name: "Addition",
      },
      currentProgress: {
        completedConcepts: [],
        inProgressConcepts: ["PAR019"],
        totalConcepts: 102,
        progressPercentage: 0,
      },
    },
    // Intermediate - working on fractions
    {
      recommendedNext: {
        conceptId: "PAR001",
        name: "Fraction Multiplication",
      },
      currentProgress: {
        completedConcepts: [
          "PAR019",
          "PAR020",
          "PAR021",
          "PAR022",
          "PAR023",
          "PAR024",
          "PAR025",
          "PAR026",
          "PAR027",
        ],
        inProgressConcepts: ["PAR001"],
        totalConcepts: 102,
        progressPercentage: 8.8,
      },
    },
    // Advanced - working on algebra
    {
      recommendedNext: {
        conceptId: "PAR058",
        name: "Equation Solving",
      },
      currentProgress: {
        completedConcepts: Array.from(
          { length: 45 },
          (_, i) => `PAR${(i + 1).toString().padStart(3, "0")}`
        ),
        inProgressConcepts: ["PAR058"],
        totalConcepts: 102,
        progressPercentage: 44.1,
      },
    },
  ];

  const scenarioIndex = userId.charCodeAt(0) % scenarios.length;
  const baseScenario = scenarios[scenarioIndex];

  return {
    ...baseScenario,
    learningPath: [
      baseScenario.recommendedNext,
      {
        conceptId: "PAR002",
        name: "Understanding 'Of' Means Multiply",
      },
      {
        conceptId: "PAR003",
        name: "Fraction Division",
      },
      {
        conceptId: "PAR004",
        name: "Understanding Reciprocals",
      },
      {
        conceptId: "PAR005",
        name: "Comparing Fractions",
      },
    ],
    adaptiveRecommendations: {
      weakAreas: [
        {
          conceptId: "PAR026",
          name: "Order of Operations",
        },
      ],
      strengthAreas: [
        {
          conceptId: "PAR019",
          name: "Addition",
        },
      ],
      suggestedReview: [
        {
          conceptId: "PAR025",
          name: "Division",
        },
      ],
    },
  };
};
