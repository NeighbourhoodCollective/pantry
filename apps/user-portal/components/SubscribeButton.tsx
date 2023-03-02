import { Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import { gql } from '@ts-gql/tag/no-transform';
import { SigninButton } from './SigninButton';
import { User } from '../types';

export function SubscribeButton({ ...props }) {
  const { data: userData } = useSession();
  const router = useRouter();

  const { variation, subscription, club } = props;
  const SUBSCRIPTION_MUTATION = gql`
    mutation SUBSCRIPTION_MUTATION($variationId: ID!, $returnUrl: String!) {
      membershipSignup(returnUrl: $returnUrl, variationId: $variationId)
    }
  ` as import('../__generated__/ts-gql/SUBSCRIPTION_MUTATION').type;

  const userSession = userData?.data as User;
  const [getStripeSession] = useMutation(SUBSCRIPTION_MUTATION, {
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  if (!userData) {
    return (
      <SigninButton
        returnUrl={`/${club}/${subscription}/subscribe?variationId=${variation.id}`}
      />
    );
  }

  const existingVariation = userSession.memberships.find(
    (m) => m.variation.id === variation.id
  );
  if (existingVariation) {
    return (
      <>
        <p>You already have this one and is it {existingVariation.status}</p>
        <Button
          // eslint-disable-next-line prettier/prettier
          variant='primary'
          // eslint-disable-next-line prettier/prettier
          type='button'
          onClick={() => router.push(`/${club}/my-membership`)}
        >
          Manage
        </Button>
      </>
    );
  }

  return (
    <Button
      onClick={async () => {
        const session = await getStripeSession({
          variables: {
            variationId: variation.id,
            returnUrl: `${window.location.origin}/${club}/${subscription}`,
          },
        });
        router.push(session?.data?.membershipSignup.url);
      }}
    >
      Subscribe
    </Button>
  );
}
