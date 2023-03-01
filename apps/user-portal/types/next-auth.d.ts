import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Membership } from '.';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id?: string;
    email?: string | null;
    role?: string | null;
    name?: string | null;
    failMessage?: string | null;
  }
  interface Session {
    adminUIAccess: boolean;
    itemId: string;
    data: {
      id: string;
      email: string;
      name: string;
      preferredName: string;
      phone: string;
      memberships: Membership[];
      householdMembers: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    email: string | null;
    role: string | null;
    allowAdminUI: boolean | null;
    account: {
      id: string;
      firstName: string | null;
      surname: string | null;
    } | null;
  }
}
