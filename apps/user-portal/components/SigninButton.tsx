import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from 'react-bootstrap';

export function SigninButton({ ...props }) {
  const { returnUrl } = props;
  const { data } = useSession();
  if (!data?.itemId)
    return (
      <Button
        onClick={() =>
          signIn('azure-ad-b2c', {
            callbackUrl: `${window.location.origin}${returnUrl || '/'}`,
          })
        }
      >
        Get Started/Sign In
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
