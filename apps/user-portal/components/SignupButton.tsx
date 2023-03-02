import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from 'react-bootstrap';

export function SignupButton() {
  const { data } = useSession();
  if (!data)
    return (
      <Button
        onClick={() =>
          signIn(
            'azure-ad-b2c',
            {
              callbackUrl: `${window.location.origin}`,
            },
            { p: 'B2C_1_oldhcurchpantrysignup' }
          )
        }
      >
        Sign Up
      </Button>
    );
  return (
    <Button
      onClick={() =>
        signOut({
          callbackUrl: `${window.location.origin}`,
        })
      }
    >
      Sign Out
    </Button>
  );
}
