import type { SVGAttributes } from 'react';

/**
 * MaMa Café — coffee cup icon used in the sidebar logo and favicon.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Steam wisps */}
            <path
                d="M8 3 C8 3 7.5 1.5 8.5 1 C9.5 0.5 9 2 9 2"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M12 3 C12 3 11.5 1.5 12.5 1 C13.5 0.5 13 2 13 2"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M16 3 C16 3 15.5 1.5 16.5 1 C17.5 0.5 17 2 17 2"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
            />
            {/* Cup body */}
            <path
                d="M4 5 H20 L18.5 17 C18.3 18.1 17.3 19 16.2 19 H7.8 C6.7 19 5.7 18.1 5.5 17 Z"
                fill="currentColor"
                opacity="0.15"
            />
            <path
                d="M4 5 H20 L18.5 17 C18.3 18.1 17.3 19 16.2 19 H7.8 C6.7 19 5.7 18.1 5.5 17 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Saucer */}
            <path
                d="M3 21 H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {/* Handle */}
            <path
                d="M20 8 C22 8 23 9 23 11 C23 13 22 14 20 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
            {/* Inner liquid highlight */}
            <path
                d="M8 9 Q12 11 16 9"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.5"
                fill="none"
            />
        </svg>
    );
}
