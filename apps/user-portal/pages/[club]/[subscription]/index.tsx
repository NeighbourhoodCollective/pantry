import { useRouter } from 'next/dist/client/router';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@ts-gql/tag/no-transform';
import { DocumentBlock } from '../../../components/DocumentBlock';

import { SubscribeButton } from '../../../components/SubscribeButton';

const SINGLE_ITEM_QUERY = gql`
  query GET_SUBSCRIPTION_QUERY($slug: String!) {
    subscription(where: { slug: $slug }) {
      name
      slug
      stripeProductId
      about {
        document
      }
      variations(orderBy: [{ name: asc }]) {
        id
        name
        stripePriceId
        about {
          document
        }
        price
        chargeInterval
        chargeIntervalCount
      }
      id
      club {
        id
        name
      }
    }
  }
` as import('../../../__generated__/ts-gql/GET_SUBSCRIPTION_QUERY').type;

export default function SubscriptionPage() {
  const router = useRouter();

  const { subscription, club } = router.query;
  if (!subscription || typeof subscription !== 'string')
    throw new Error('No subscription');
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      slug: subscription,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.subscription)
    return <p>No subscription found for {subscription}</p>;
  return (
    <Container>
      <Row>
        <h2>{data.subscription.name}</h2>
        <DocumentBlock document={data?.subscription?.about?.document} />
      </Row>
      <br />
      {data?.subscription?.variations?.map((variation: any) => (
        <Row key={variation.id}>
          <h2>{variation.name}</h2>
          <DocumentBlock document={variation.about.document} />
          <SubscribeButton
            variation={variation}
            club={club}
            subscription={subscription}
          />
          <br />
        </Row>
      ))}
      <br />
      <br />
      <Button
        variant="primary"
        type="button"
        onClick={() => router.push(`/${club}`)}
      >
        Back to {data?.subscription?.club?.name}
      </Button>
    </Container>
  );
}
