// generics types
interface Book {
    id: number;
    title: string; 
    author: string; 
    genre: string; 
    rating: number; 
    total_Copies:  number; 
    available_Copies: number;
    description: string; 
    coverColor: string; 
    coverUrl: string;
    video: string;
    summary: string;
    isLonedBook?: boolean;
}