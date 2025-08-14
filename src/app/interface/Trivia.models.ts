export interface Trivia {
    id?: string;
    type:'text' | 'image';
    question: string;
    options:Options[];
    correct: number; 
    imageUrl?:string
    level:string; //basic - medium - hard - expert
    explanation:string
}

export interface Options {
    option: string
}