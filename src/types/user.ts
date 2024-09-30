export type User = {
    name: string;
    email: string;
    username: string;
    id: number;
    isVerified: Boolean | null;
    otp?: string | null;
    isOtpValid?: Date | null; 
    password?: string | null;
};