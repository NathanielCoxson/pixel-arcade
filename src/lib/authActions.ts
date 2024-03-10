import { AuthError } from "next-auth";
import { signIn } from "@/auth";

/**
 * Login server action that authenticates a user given their password and username
 * as credentials. 
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', { username: formData.get('username'), password: formData.get('password') });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
