// generics types
// global typescript interface
interface Book {
    id: string;
    title: string; 
    author: string; 
    genre: string; 
    rating: number; 
    totalCopies:  number; 
    availableCopies: number;
    description: string; 
    coverColor: string; 
    coverUrl: string;
    videoUrl: string;
    summary: string;
    createdAt: Date | null;
}

interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: number;
    universityCard: string;
}

interface BookParams {
    title: string;
    author: string;
    genre: string;
    rating: number;
    coverUrl: string;
    coverColor: string;
    description: string;
    totalCopies: number;
    videoUrl: string;
    summary: string;
}

interface BorrowBookParams {
    bookId: string;
    userId: string;
}

interface PageProps {
    searchParams: Promise<{
      query?: string;
      sort?: string;
      page?: number;
    }>;
    params: Promise<{ id: string }>;
}

interface BorrowedBook extends Book {
    borrow: BorrowRecord;
    user?: User;
}