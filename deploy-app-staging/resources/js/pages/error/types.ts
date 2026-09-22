export type ErrorStatusCode = 403 | 404 | 429 | 500 | 502 | 503 | 504;

export interface ErrorConfig {
    title: string;
    description: string;
    color: string;
    icon: any;
    suggestions: string[];
    showRetry?: boolean;
    autoRetry?: boolean;
}

export interface ErrorPageProps {
    status?: number;
    message?: string;
    requestId?: string;
    debug?: {
        message: string;
        file: string;
        line: number;
        trace?: string[];
    };
}
