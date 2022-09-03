import { useRouter } from 'next/dist/client/router';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@ts-gql/tag/no-transform';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteSubscription(where: { id: $id }) {
      id
    }
  }
` as import('../../../__generated__/ts-gql/DELETE_ITEM_MUTATION').type;

const GET_MEMBERSHIP_QUERY = gql`
  query GET_MEMBERSHIP_QUERY($session_id: String!) {
    membership(where: { signupSessionId: $session_id }) {
      id
      status
      variation {
        id
        name
        subscription {
          id
          name
          slug
        }
      }
    }
  }
` as import('../../../__generated__/ts-gql/GET_MEMBERSHIP_QUERY').type;

export default function SubscriptionPage() {
  const router = useRouter();
  // TODO: fix the thing that breaks membership when a user clicks back

  // eslint-disable-next-line camelcase
  const { subscription, club, returnStatus, session_id } = router.query;
  if (!subscription || typeof subscription !== 'string')
    throw new Error('No subscription');

  // eslint-disable-next-line camelcase
  if (!session_id || typeof session_id !== 'string')
    throw new Error('No session_id');
  const { loading, error, data } = useQuery(GET_MEMBERSHIP_QUERY, {
    variables: {
      session_id,
    },
  });
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  if (returnStatus === 'success') {
    return (
      <Container>
        {data && (
          <Row>
            <h2>Thanks for becoming a member</h2>
            <p> Variation - {data?.membership?.variation?.name}</p>
            <p> Status - {data?.membership?.status}</p>
          </Row>
        )}
        <br />
        <Button
          variant="primary"
          type="button"
          onClick={() => router.push(`/${club}`)}
        >
          Back to Home
        </Button>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        <h2>
          Opps - either something went wrong, or the process was cancelled
        </h2>
        <p> Maybe try again or contact the ${club}</p>
      </Row>
      <Button
        variant="primary"
        type="button"
        onClick={() => {
          // delete the membership
          if (!data?.membership?.id) throw new Error('No membership id');
          deleteItem({
            variables: {
              id: data?.membership?.id,
            },
          });
          router.push(`/${club}`);
        }}
      >
        Back to Home
      </Button>
    </Container>
  );
}
