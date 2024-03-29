import { useRouter } from 'next/dist/client/router';
import { useSession } from 'next-auth/react';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@ts-gql/tag/no-transform';
import { SubscribeButton } from '../../../components/SubscribeButton';
import { SigninButton } from '../../../components/SigninButton';

const SINGLE_ITEM_QUERY = gql`
  query GET_VARIATION_QUERY($variationId: ID!) {
    variation(where: { id: $variationId }) {
      name
      about {
        document
      }
      id
      subscription {
        id
        name
        slug
        club {
          id
          name
        }
      }
    }
  }
` as import('../../../__generated__/ts-gql/GET_VARIATION_QUERY').type;

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: userData, status } = useSession();

  const { subscription, club, variationId } = router.query;
  if (!variationId || typeof variationId !== 'string')
    throw new Error('No variationId');
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      variationId,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.variation) return <p>No subscription found for {subscription}</p>;
  return (
    <Container>
      <Row>
        <h2>Add Membership - {data?.variation.name}</h2>
      </Row>
      <br />
      {!userData ? (
        <SigninButton returnUrl={`/${club}/${subscription}`} />
      ) : (
        <SubscribeButton
          variation={data.variation}
          subscription={subscription}
          club={club}
        />
      )}
      <br />
      <br />
      <Button
        variant="primary"
        type="button"
        onClick={() => router.push(`/${club}`)}
      >
        Back to {data?.variation?.subscription?.club?.name}
      </Button>
    </Container>
  );
}
