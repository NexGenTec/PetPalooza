export interface Trivia {
    id?: string;
    question: string;
    options:Options[];
    correct: number;
    // correct: boolean;
}

export interface Options {
    option: string
}